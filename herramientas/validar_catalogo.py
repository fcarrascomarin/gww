#!/usr/bin/env python3
"""Valida catálogo preliminar público sin datos personales ni afirmaciones de monitoreo."""
import json, math
from pathlib import Path
root=Path(__file__).resolve().parents[1]
obj=json.loads((root/'data/cuerpos-agua-publicos.geojson').read_text(encoding='utf-8'))
assert obj.get('type')=='FeatureCollection'
features=obj.get('features')
assert isinstance(features,list) and features
ids=set()
for n,f in enumerate(features,1):
    assert f.get('type')=='Feature',n
    fid=f.get('id')
    assert isinstance(fid,str) and fid not in ids,(n,fid)
    ids.add(fid)
    p=f.get('properties') or {}
    assert p.get('mostrar_referencia_publica') is True,fid
    assert p.get('aprobado_publicacion') is False,('No atribuir autorización formal a referencia preliminar',fid)
    assert isinstance(p.get('nombre'),str) and p['nombre'].strip(),fid
    assert p.get('metodos_publicos')==[],('Metodologías no acreditadas en lista comunal',fid)
    bad={'organizaciones','voluntarios','voluntario','grupo','grupo_id','coordinador','correo','email','telefono','celular','certificaciones','monitor_id','estacion_precisa'}
    assert not (bad & {k.lower() for k in p}),fid
    geom=f.get('geometry')
    if geom is None:
        assert p.get('estado_geografico')=='pendiente',fid
    else:
        assert geom.get('type')=='Point',fid
        coords=geom.get('coordinates')
        assert isinstance(coords,list) and len(coords)==2 and all(isinstance(x,(int,float)) and math.isfinite(x) for x in coords),fid
        lon,lat=coords
        assert -114<=lon<=-65 and -57<=lat<=-17,fid
        assert p.get('estado_geografico')=='referencial',fid
        assert p.get('fuente_geo'),('Falta fuente de localización pública',fid)
print(f'Validado: {len(features)} referencias; {sum(bool(f["geometry"]) for f in features)} georreferenciadas; {sum(not f["geometry"] for f in features)} pendientes. Revisión institucional previa a publicación final pendiente.')
