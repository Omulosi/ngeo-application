import os
from django.contrib.gis.utils import LayerMapping
from .models import KenyaHealth

DATA_DIR_NAME = os.path.join("data", "Kenya_health")

# Auto-generated `LayerMapping` dictionary for KenyaHealth model
kenyahealth_mapping = {
    'fno': 'FNO',
    'f_name': 'F_NAME',
    'hmis_field': 'HMIS_',
    'prov': 'PROV',
    'dist': 'DIST',
    'division': 'DIVISION',
    'location': 'LOCATION',
    'sub_locati': 'SUB_LOCATI',
    'long': 'LONG',
    'lat': 'LAT',
    'spatial_re': 'SPATIAL_RE',
    'f_type': 'F_TYPE',
    'agency': 'AGENCY',
    'geom': 'MULTIPOINT',
}

kenyahealth_shp = os.path.abspath(
    os.path.join(os.path.dirname(__file__), DATA_DIR_NAME, "Kenya_health.shp")
)


def run(verbose=True):
    """
    This function uses the LayerMapping import utility to
    load a shapefile to the database
    """
    # Takes model name, path to shapefile, mapping dict, encoding format
    lm = LayerMapping(
        KenyaHealth, kenyahealth_shp, kenyahealth_mapping, transform=False, encoding="iso-8859-1"
    )
    lm.save(strict=True, verbose=verbose)
