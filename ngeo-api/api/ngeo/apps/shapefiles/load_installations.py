import os
from django.contrib.gis.utils import LayerMapping
from .models import IsioloKeyInstallation

DATA_DIR_NAME = os.path.join("data", "installations")

# Auto-generated `LayerMapping` dictionary for IsioloKeyInstallation model
isiolokeyinstallation_mapping = {
    'id': 'Id',
    'inst_name': 'Inst_Name',
    'type': 'Type',
    'sub_type': 'Sub_type',
    'longitude': 'Longitude',
    'latitude': 'Latitude',
    'geom': 'MULTIPOINT',
}


isiolo_key_installations_shp = os.path.abspath(
    os.path.join(os.path.dirname(__file__), DATA_DIR_NAME, "Isiolo_Key_Installations.shp")
)


def run(verbose=True):
    """
    This function uses the LayerMapping import utility to
    load a shapefile to the database
    """
    # Takes model name, path to shapefile, mapping dict, encoding format
    lm = LayerMapping(
        IsioloKeyInstallation, 
        isiolo_key_installations_shp, 
        isiolokeyinstallation_mapping, 
        transform=False, 
        encoding="iso-8859-1"
    )
    lm.save(strict=True, verbose=verbose)
