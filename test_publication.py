"""Pruebas de no divulgación involuntaria."""
import sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1] / 'scripts'))
from build_public_catalog import build_private_to_public
import json

class PublicationTests(unittest.TestCase):
    def setUp(self):
        self.data={'water_bodies':[{
            'id':'rio-prueba','name':'Río Ficticio','type':'Río','region':'Región ficticia',
            'basin':'Cuenca de prueba','catalog_authorized':True,
            'public_location':{'approved':True,'precision':'generalizada','latitude':-37.1,'longitude':-72.2},
            'secret_station_location':{'latitude':-37.150123,'longitude':-72.279912},
            'groups':[
                {'name':'AGRUPACION_PRIVADA','members':['MONITORA_PRIVADA'],
                 'publication_policy':{'approved':True,'catalog_visibility_approved':True,'location_visibility_approved':True,'allowed_parameters':['ph']},
                 'observations':[
                    {'date':'2024-09-01','quality_status':'validated','publication_approved':True,
                     'notes':'NOTA_SECRETA','measurements':[{'parameter':'ph','value':7.2,'unit':''},{'parameter':'temperature','value':13,'unit':'°C'}]},
                    {'date':'2024-10-01','quality_status':'validated','publication_approved':False,
                     'measurements':[{'parameter':'ph','value':99.9,'unit':''}]},
                    {'date':'2024-11-01','quality_status':'draft','publication_approved':True,
                     'measurements':[{'parameter':'ph','value':88.8,'unit':''}]}
                 ]},
                {'name':'ORGANIZACION_DENEGADA','publication_policy':{'approved':False,'catalog_visibility_approved':False,'location_visibility_approved':False,'allowed_parameters':['ph']},
                 'observations':[{'date':'2024-12-01','quality_status':'validated','publication_approved':True,'measurements':[{'parameter':'ph','value':77.7,'unit':''}]}]}
            ]
        }]}
    def test_only_authorized_quality_and_parameters(self):
        public=build_private_to_public(self.data)
        s=json.dumps(public,ensure_ascii=False)
        for secret in ['AGRUPACION_PRIVADA','MONITORA_PRIVADA','ORGANIZACION_DENEGADA','NOTA_SECRETA','99.9','88.8','77.7','13.0','-37.150123']:
            self.assertNotIn(secret,s)
        self.assertEqual(public['water_bodies'][0]['series'][0]['measurements'],[{'date':'2024-09-01','value':7.2}])
        self.assertEqual(public['water_bodies'][0]['longitude'],-72.2)
    def test_no_catalog_without_group_visibility(self):
        self.data['water_bodies'][0]['groups'][0]['publication_policy']['catalog_visibility_approved']=False
        self.assertEqual(build_private_to_public(self.data)['water_bodies'],[])
    def test_no_geo_without_group_geolocation_permission(self):
        self.data['water_bodies'][0]['groups'][0]['publication_policy']['location_visibility_approved']=False
        self.assertNotIn('latitude',build_private_to_public(self.data)['water_bodies'][0])
    def test_no_catalog_without_explicit_approval(self):
        self.data['water_bodies'][0]['catalog_authorized']=False
        self.assertEqual(build_private_to_public(self.data)['water_bodies'],[])
    def test_no_pin_without_location_approval(self):
        self.data['water_bodies'][0]['public_location']['approved']=False
        b=build_private_to_public(self.data)['water_bodies'][0]
        self.assertNotIn('latitude',b)
        self.assertNotIn('longitude',b)
    def test_no_obs_without_group_approval(self):
        self.data['water_bodies'][0]['groups'][0]['publication_policy']['approved']=False
        self.assertEqual(build_private_to_public(self.data)['water_bodies'][0]['series'],[])
    def test_mismatched_units_error(self):
        self.data['water_bodies'][0]['groups'][0]['observations'].append({'date':'2024-12-31','quality_status':'validated','publication_approved':True,'measurements':[{'parameter':'ph','value':7.1,'unit':'diferente'}]})
        with self.assertRaises(ValueError): build_private_to_public(self.data)

if __name__ == '__main__':unittest.main()
