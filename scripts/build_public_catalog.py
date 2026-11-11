#!/usr/bin/env python3
"""Publica SOLO información expresamente autorizada para el portal GWW Chile.

Uso: python scripts/build_public_catalog.py --input /RUTA_PRIVADA/registros.json \
    --output data/public-water-bodies.json

IMPORTANTE: el input contiene datos privados y NO debe colocarse en /data ni en
la raíz servida por el sitio. El exportador no transmite IDs, nombres de grupos,
monitores, coordenadas de estaciones, notas ni metadatos privados.
"""
import argparse
from collections import defaultdict
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
import json
from pathlib import Path

# Catálogo controlado para que no entren etiquetas libres a la web pública.
PARAMETERS = {
    'ph': ('pH', ''),
    'temperature': ('Temperatura', '°C'),
    'dissolved_oxygen': ('Oxígeno disuelto', 'mg/L'),
    'total_hardness': ('Dureza total', 'mg/L CaCO3'),
    'alkalinity': ('Alcalinidad', 'mg/L CaCO3'),
    'turbidity': ('Turbidez', ''),
    'ecoli': ('E. coli', ''),
    'biotic_index': ('Índice biótico', ''),
}

def valid_date(s):
    if not isinstance(s, str): return False
    try:
        return datetime.strptime(s, '%Y-%m-%d').strftime('%Y-%m-%d') == s
    except ValueError:
        return False

def positive_coordinates(loc):
    if not isinstance(loc, dict) or loc.get('approved') is not True: return None
    if loc.get('precision') not in {'generalizada', 'aproximada'}: return None
    try: lat,lon=float(loc['latitude']),float(loc['longitude'])
    except (KeyError, TypeError, ValueError): return None
    if not (-56<=lat<=-17 and -110<=lon<=-66): return None
    return {'latitude':lat, 'longitude':lon, 'location_precision':'aproximada'}

def build_private_to_public(doc):
    if not isinstance(doc,dict) or not isinstance(doc.get('water_bodies'),list):
        raise ValueError('Entrada inválida: se exige water_bodies como arreglo.')
    output = []
    seen_ids=set()
    for body in doc['water_bodies']:
        if body.get('catalog_authorized') is not True: continue
        groups=body.get('groups',[])
        # Visibilidad nacional y al menos una autorización explícita de agrupación.
        visible_groups=[g for g in groups if (g.get('publication_policy') or {}).get('catalog_visibility_approved') is True]
        if not visible_groups: continue
        bodyid=body.get('id')
        if not isinstance(bodyid,str) or not bodyid or bodyid in seen_ids:
            raise ValueError('Identificador de cuerpo de agua inexistente o duplicado.')
        seen_ids.add(bodyid)
        if not all(isinstance(body.get(k),str) and body[k].strip() for k in ('name','type','region')):
            raise ValueError('Faltan nombre, tipo o región del cuerpo de agua aprobado.')
        # Solo los campos de la siguiente lista salen del sistema privado.
        item={k:body[k].strip() for k in ('id','name','type','region')}
        item['basin']=body.get('basin','').strip() if isinstance(body.get('basin',''),str) else ''
        coord=positive_coordinates(body.get('public_location')) if any((g.get('publication_policy') or {}).get('location_visibility_approved') is True for g in visible_groups) else None
        if coord: item.update(coord)
        series=defaultdict(list)
        units_by_parameter={}
        for group in visible_groups:
            policy=group.get('publication_policy') or {}
            if policy.get('approved') is not True: continue
            if (policy.get('from') and not valid_date(policy['from'])) or (policy.get('to') and not valid_date(policy['to'])):
                raise ValueError('Período de autorización inválido: revisar antes de exportar.')
            allowed=set(policy.get('allowed_parameters',[])) & PARAMETERS.keys()
            if not allowed: continue
            for obs in group.get('observations',[]):
                if obs.get('publication_approved') is not True or obs.get('quality_status') != 'validated': continue
                date=obs.get('date')
                if not valid_date(date): continue
                if valid_date(policy.get('from')) and date < policy['from']: continue
                if valid_date(policy.get('to')) and date > policy['to']: continue
                for measurement in obs.get('measurements',[]):
                    param=measurement.get('parameter')
                    if param not in allowed or param not in PARAMETERS: continue
                    value=measurement.get('value')
                    if isinstance(value,bool): continue
                    try: n=Decimal(str(value))
                    except (InvalidOperation,ValueError,TypeError): continue
                    if not n.is_finite():continue
                    # Sin inferir ni convertir unidades: mezclar unidades se rechaza.
                    unit=measurement.get('unit','')
                    if not isinstance(unit,str) or len(unit)>35: continue
                    if param in units_by_parameter and units_by_parameter[param] != unit:
                        raise ValueError(f'Unidades inconsistentes en {bodyid}, parámetro {param}; normalizar antes de publicar.')
                    units_by_parameter[param]=unit
                    series[param].append({'date':date,'value':float(n)})
        item['series']=[{'parameter':p, 'label':PARAMETERS[p][0], 'unit':units_by_parameter[p],
                         'measurements':sorted(values,key=lambda o:o['date'])}
                        for p,values in sorted(series.items()) if values]
        output.append(item)
    return {'schema_version':1,
            'issued_at':datetime.now(timezone.utc).date().isoformat(),
            'publication_status':'approved_only' if output else 'no_approved_records',
            'water_bodies':sorted(output,key=lambda b:b['name'].casefold())}

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--input',required=True, type=Path,help='JSON PRIVADO fuera del directorio web')
    ap.add_argument('--output',required=True,type=Path)
    args=ap.parse_args()
    webroot=Path(__file__).resolve().parents[1]
    if args.input.resolve().is_relative_to(webroot):
        ap.error('Por seguridad, el archivo privado de entrada debe estar FUERA del directorio web.')
    source=json.loads(args.input.read_text(encoding='utf-8'))
    public=build_private_to_public(source)
    args.output.parent.mkdir(parents=True,exist_ok=True)
    args.output.write_text(json.dumps(public,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f"Publicación generada: {len(public['water_bodies'])} cuerpos de agua con catálogo autorizado.")

if __name__=='__main__':main()
