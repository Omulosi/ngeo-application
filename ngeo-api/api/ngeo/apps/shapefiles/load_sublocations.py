import os
from django.contrib.gis.utils import LayerMapping
from ngeo.apps.shapefiles.models import SubLocation

DATA_DIR_NAME = os.path.join("data", "sub_locations")

# Auto-generated `LayerMapping` dictionary for SubLocation model
sublocation_mapping = {
    'objectid': 'OBJECTID',
    'locname': 'LOCNAME',
    'divname': 'DIVNAME',
    'distname': 'DISTNAME',
    'provname': 'PROVNAME',
    'code_sub': 'CODE_SUB',
    'sub_name': 'SUB_NAME',
    'shape_leng': 'Shape_Leng',
    'shape_area': 'Shape_Area',
    'geom': 'MULTIPOLYGON',
}

sublocation_shp = os.path.abspath(
    os.path.join(os.path.dirname(__file__), DATA_DIR_NAME, "Sub_locations.shp")
)


def run(verbose=True):
    """
    This function uses the LayerMapping import utility to
    load a shapefile to the database
    """
    # Takes model name, path to shapefile, mapping dict, encoding format
    lm = LayerMapping(
        SubLocation, sublocation_shp, sublocation_mapping, transform=False, encoding="iso-8859-1"
    )
    lm.save(strict=True, verbose=verbose)
