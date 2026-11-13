#!/usr/bin/env python3
"""Valida la estructura y la procedencia de geometrías del catálogo público."""
from __future__ import annotations
import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / 'data' / 'cuerpos-agua.geojson'
GEOMETRY_TYPES = {'Point','LineString','MultiLineString','Polygon','MultiPolygon'}
PRIVATE_KEYS = {'voluntarios','monitores','organizaciones','emails','telefono','contacto','estaciones','coordenadas_estacion', 'identidad_personal','certificaciones_personales'}


def validate():
    errors=[]
    content=json.loads(CATALOG.read_text(encoding='utf-8'))
    if content.get('type')!='FeatureCollection' or not isinstance(content.get('features'),list):
        return ['El archivo debe ser un FeatureCollection con arreglo features.']
    ids=set()
    for i,feature in enumerate(content['features'],1):
        prefix=f'Ficha {i}'
        if feature.get('type')!='Feature':errors.append(f'{prefix}: type debe ser Feature')
        identity=feature.get('id')
        if not identity or identity in ids:errors.append(f'{prefix}: identificador vacío o duplicado')
        ids.add(identity)
        props=feature.get('properties') or {}
        for key in ['nombre','region','tipo','comuna']:
            if not isinstance(props.get(key),str) or not props[key].strip():errors.append(f'{prefix}: falta {key}')
        seen=set(map(str.lower,props))
        if PRIVATE_KEYS & seen:errors.append(f'{prefix}: se detectaron campos internos: {sorted(PRIVATE_KEYS&seen)}')
        geom=feature.get('geometry')
        if geom is None:continue
        typ=geom.get('type')
        if typ not in GEOMETRY_TYPES:
            errors.append(f'{prefix}: geometría no admitida {typ}')
            continue
        coords=geom.get('coordinates')
        def visit(value):
            if isinstance(value,(list,tuple)) and len(value)>=2 and all(isinstance(v,(float,int)) for v in value[:2]):
                lon,lat=value[:2]
                if not (-180<=lon<=180 and -90<=lat<=90):errors.append(f'{prefix}: coordenada fuera de WGS84')
            elif isinstance(value,(list,tuple)):
                for element in value:visit(element)
            else:
                errors.append(f'{prefix}: coordenada incorrecta')
        visit(coords)
        if typ in {'Polygon','MultiPolygon'}:
            if props.get('calidad_geometria')!='delimitacion_validada':
                errors.append(f'{prefix}: un polígono exige calidad_geometria=delimitacion_validada')
            if not props.get('fuente_cartografica'):
                errors.append(f'{prefix}: un polígono exige fuente_cartografica')
            try:date.fromisoformat(props.get('fecha_geometria',''))
            except ValueError:errors.append(f'{prefix}: fecha_geometria debe tener formato AAAA-MM-DD')
            polygons=[coords] if typ=='Polygon' else coords
            for polygon in polygons:
                if not isinstance(polygon,list) or not polygon:errors.append(f'{prefix}: polígono vacío');continue
                for ring in polygon:
                    if not isinstance(ring,list) or len(ring)<4 or ring[0]!=ring[-1]:
                        errors.append(f'{prefix}: anillo poligonal no cerrado o muy corto')
    return errors


if __name__=='__main__':
    problems=validate()
    if problems:
        print('Errores del catálogo:')
        for item in problems:print(' - '+item)
        sys.exit(1)
    print('Catálogo válido: estructura y procedencia de geometrías aceptadas.')
