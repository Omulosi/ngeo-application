"""
Loads projects from an excel file.

Key Fields: Latitude (dec), Longitude (dec), Name (str), Theme (str), County (str), Region (str), Control (str)
"""
from django.core.management.base import BaseCommand
from django.conf import settings
import pandas as pd
from io import StringIO
from django.contrib.gis.geos import fromstr
import csv
from ngeo.apps.account.models import User
from ngeo.apps.projects.models import Project, THEME_CHOICES
from django.db.models import Q
from ngeo.apps.themes.models import Theme
from ngeo.apps.common.models import Area



class Command(BaseCommand):
    help = 'Load projects from an excel file specified in a file_path argument'

    def add_arguments(self, parser):
        parser.add_argument("file_path", type=str, help='File path of excel file containing projects')
    
    def handle(self, *args, **options):
        
        try:
            project_file = options['file_path']
            df = pd.read_excel(project_file)
            # Convert data to csv for ease of reading
            project_data = csv.DictReader(StringIO(df.to_csv()))
            project_list = []
            for row in project_data:
                data = {}
                project_name = row['NAME']
                project = self.get_project(project_name)
                # Skip if project already exists
                if project is not None:
                    print(f'The Project {project_name} already exists, skipping...')
                    continue
                data['name'] = project_name
                latitude = row['Latitude']
                longitude = row['Longitude']
                theme_name = row['THEME']
                theme = self.get_theme(theme_name)
                if theme is None:
                    print(f'The theme {theme_name} does not exist, skipping...')
                    continue
                data['theme'] = theme
                data['county'] = row['COUNTY']
                data['region'] = row['REGION']
                data['initiated_by'] = row['CONTROL']
                #
                county = row['COUNTY']
                region = row['REGION']
                data['county'] = county
                data['region'] = region
                if county and region:
                    area = Area.objects.create(county=county, region=region)
                    data['area'] = area
                data['latitude'] = latitude
                data['longitude'] = longitude
                if longitude and latitude:
                    location = fromstr(f"POINT({longitude} {latitude})", srid=4326)
                    data["location"] = location
                project_list.append(Project(**data))
            Project.objects.bulk_create(list(project_list))
            print('Projects successfully added to the DB!')
                
        except Exception as e:
            import pdb;pdb.set_trace()
            print('Error loading projects: ', e)
    
    @staticmethod
    def get_theme(theme_name):
        try:
            theme = Theme.objects.get(name__icontains=theme_name)
            return theme
        except Theme.DoesNotExist:
            return None
        except Exception as e:
            print('Error getting theme, skipping...: ', e)
            raise

    @staticmethod
    def get_project(project_name):
        try:
            project_name = project_name.strip()
            project = Project.objects.get(name__iexact=project_name)
            return project
        except Project.DoesNotExist:
            return None
        except Exception as e:
            return None
