import os
# from django.contrib.gis.utils import LayerMapping
# from ngeo.apps.shapefiles.models import Constituency

# DATA_DIR_NAME = os.path.join("data", "constituencies")

# # Auto-generated `LayerMapping` dictionary for Constituency model
# constituency_mapping = {
#     'const_nam': 'CONST_NAM',
#     'const_no': 'CONST_NO',
#     'county_nam': 'COUNTY_NAM',
#     'st_area_sh': 'ST_AREA_SH',
#     'st_length_field': 'ST_LENGTH_',
#     'geom': 'MULTIPOLYGON',
# }

# const_shp = os.path.abspath(
#     os.path.join(os.path.dirname(__file__), DATA_DIR_NAME, "kenya constituencies.shp")
# )


# def run(verbose=True):
#     """
#     This function uses the LayerMapping import utility to
#     load a shapefile to the database
#     """
#     # Takes model name, path to shapefile, mapping dict, encoding format
#     lm = LayerMapping(
#         Constituency, const_shp, constituency_mapping, transform=False, encoding="iso-8859-1"
#     )
#     lm.save(strict=True, verbose=verbose)
