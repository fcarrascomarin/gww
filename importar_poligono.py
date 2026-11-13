#!/usr/bin/env python3
"""Incorpora una delimitación ya revisada a un cuerpo de agua del catálogo público.

Ejemplo:
 python tools/importar_poligono.py --id humedal-culebron \\
  --geojson archivo_oficial.geojson \\
  --fuente 'https://ide.mma.gob.cl/...' --fecha 2026-11-13

El archivo de entrada debe ser GeoJSON RFC 7946 en WGS84, con un único
Polygon/MultiPolygon correspondiente exactamente al cuerpo de agua elegido.
No se usa para dibujar perímetros inferidos ni importar estaciones de muestreo.
"""
from __future__ import annotations
import argparse
from datetime import date
import json
from pathlib import Path

BASE=Path(__file__).resolve().parents[1]
CATALOG=BASE/'data'/'cuerpos-agua.geojson'


def extract_geometry(path):
    document=json.loads(Path(path).read_text(encoding='utf-8'))
    if document.get('type')=='FeatureCollection':
        features=document.get('features',[])
        if len(features)!=1:raise ValueError('Se exige exactamente una geometría por archivo; seleccione el objeto en QGIS.')
        geometry=features[0].get('geometry')
    elif document.get('type')=='Feature':geometry=document.get('geometry')
    else:geometry=document
    if not isinstance(geometry,dict) or geometry.get('type') not in ('Polygon','MultiPolygon'):
        raise ValueError('La entrada debe contener Polygon o MultiPolygon.')
    # Shapely, si está disponible, detecta auto-intersecciones u otros problemas geométricos.
    try:
        from shapely.geometry import shape
    except ImportError:
        pass
    else:
        polygon=shape(geometry)
        if polygon.is_empty or not polygon.is_valid:
            raise ValueError('La geometría es vacía o topológicamente inválida. Repare en QGIS antes de importarla.')
    return geometry


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--id',required=True,help='Identificador del cuerpo de agua en el catálogo')
    parser.add_argument('--geojson',required=True,help='GeoJSON validado en EPSG:4326')
    parser.add_argument('--fuente',required=True,help='URL o identificación de la capa cartográfica oficial')
    parser.add_argument('--fecha',required=True,help='Fecha de consulta o publicación de la geometría, AAAA-MM-DD')
    parser.add_argument('--salida',default=str(CATALOG),help='Ruta del catálogo actualizado')
    args=parser.parse_args()
    date.fromisoformat(args.fecha)
    geometry=extract_geometry(args.geojson)
    catalog=json.loads(CATALOG.read_text(encoding='utf-8'))
    matches=[feature for feature in catalog['features'] if feature.get('id')==args.id]
    if len(matches)!=1:raise ValueError('El ID no existe o no es único.')
    feature=matches[0]
    feature['geometry']=geometry
    properties=feature['properties']
    properties['calidad_geometria']='delimitacion_validada'
    properties['fuente_cartografica']=args.fuente
    properties['fecha_geometria']=args.fecha
    properties['precision_publica']='Delimitación cartográfica de la fuente indicada; no representa estaciones de muestreo'
    target=Path(args.salida)
    target.write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f'Geometría incorporada para {args.id}: {geometry["type"]}. Revise visualmente y valide el catálogo.')

if __name__=='__main__':main()
