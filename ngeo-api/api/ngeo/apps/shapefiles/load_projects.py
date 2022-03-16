import os
from django.contrib.gis.utils import LayerMapping
from .models import IsioloProject

DATA_DIR_NAME = os.path.join("data", "isiolo_projects")

# Auto-generated `LayerMapping` dictionary for IsioloProject model
isioloproject_mapping = {
    'objectid': 'OBJECTID',
    'fname': 'FName',
    'latitude': 'Latitude',
    'longitude': 'Longitude',
    'altitude': 'Altitude',
    'couname': 'CouName',
    'scouname': 'SCouName',
    'divname': 'DivName',
    'locname': 'LocName',
    'slname': 'SLName',
    'constname': 'ConstName',
    'wardname': 'WardName',
    'villname': 'VillName',
    'foo': 'FOO',
    'theme': 'Theme',
    'control': 'Control',
    'geom': 'MULTIPOINT25D',
}

isiolo_projects_shp = os.path.abspath(
    os.path.join(os.path.dirname(__file__), DATA_DIR_NAME, "Isiolo_projects.shp")
)


def run(verbose=True):
    """
    This function uses the LayerMapping import utility to
    load a shapefile to the database
    """
    # Takes model name, path to shapefile, mapping dict, encoding format
    lm = LayerMapping(
        IsioloProject, isiolo_projects_shp, isioloproject_mapping, transform=False, encoding="iso-8859-1"
    )
    lm.save(strict=True, verbose=verbose)
