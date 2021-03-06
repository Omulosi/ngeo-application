# Generated by Django 3.1.5 on 2021-04-01 20:02

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Constituency',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('const_nam', models.CharField(max_length=50)),
                ('const_no', models.BigIntegerField()),
                ('county_nam', models.CharField(max_length=50)),
                ('st_area_sh', models.FloatField()),
                ('st_length_field', models.FloatField()),
                ('geom', django.contrib.gis.db.models.fields.MultiPolygonField(srid=4326)),
            ],
            options={
                'verbose_name_plural': 'Constituencies',
            },
        ),
        migrations.CreateModel(
            name='County',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('counties', models.CharField(max_length=25)),
                ('codes', models.IntegerField()),
                ('cty_code', models.CharField(max_length=24)),
                ('dis', models.IntegerField(blank=True, default=0, null=True)),
                ('geom', django.contrib.gis.db.models.fields.MultiPolygonField(srid=4326)),
            ],
            options={
                'verbose_name_plural': 'Counties',
            },
        ),
        migrations.CreateModel(
            name='CountyGazetted',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('const_nam', models.CharField(blank=True, max_length=50, null=True)),
                ('const_no', models.BigIntegerField(blank=True, null=True)),
                ('county_nam', models.CharField(blank=True, max_length=50, null=True)),
                ('st_area_sh', models.FloatField(blank=True, null=True)),
                ('st_length_field', models.FloatField(blank=True, null=True)),
                ('counties', models.CharField(blank=True, max_length=30, null=True)),
                ('count', models.BigIntegerField(blank=True, null=True)),
                ('country', models.CharField(blank=True, max_length=16, null=True)),
                ('area_sqkm', models.FloatField(blank=True, null=True)),
                ('color_code', models.CharField(blank=True, max_length=50, null=True)),
                ('data_colle', models.CharField(blank=True, max_length=50, null=True)),
                ('phase', models.CharField(blank=True, max_length=50, null=True)),
                ('geom', django.contrib.gis.db.models.fields.MultiPolygonField(srid=4326)),
            ],
            options={
                'verbose_name_plural': 'Counties - Gazetted',
            },
        ),
        migrations.CreateModel(
            name='IsioloKeyInstallation',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('inst_name', models.CharField(max_length=50)),
                ('type', models.CharField(max_length=50)),
                ('sub_type', models.CharField(max_length=50)),
                ('longitude', models.CharField(max_length=50)),
                ('latitude', models.CharField(max_length=50)),
                ('geom', django.contrib.gis.db.models.fields.MultiPointField(srid=4326)),
            ],
            options={
                'verbose_name_plural': 'Isiolo Key Installations',
            },
        ),
        migrations.CreateModel(
            name='IsioloProject',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('objectid', models.IntegerField()),
                ('fname', models.CharField(max_length=254)),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
                ('altitude', models.FloatField()),
                ('couname', models.CharField(max_length=254)),
                ('scouname', models.CharField(max_length=254)),
                ('divname', models.CharField(max_length=254)),
                ('locname', models.CharField(max_length=254)),
                ('slname', models.CharField(max_length=254)),
                ('constname', models.CharField(max_length=254)),
                ('wardname', models.CharField(max_length=254)),
                ('villname', models.CharField(max_length=254)),
                ('foo', models.CharField(blank=True, max_length=50, null=True)),
                ('theme', models.CharField(max_length=50)),
                ('control', models.CharField(max_length=50)),
                ('geom', django.contrib.gis.db.models.fields.MultiPointField(srid=4326)),
            ],
            options={
                'verbose_name_plural': 'Isiolo projects',
            },
        ),
        migrations.CreateModel(
            name='KenyaHealth',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fno', models.IntegerField(blank=True, null=True)),
                ('f_name', models.CharField(blank=True, max_length=32, null=True)),
                ('hmis_field', models.IntegerField(blank=True, null=True)),
                ('prov', models.CharField(blank=True, max_length=12, null=True)),
                ('dist', models.CharField(blank=True, max_length=16, null=True)),
                ('division', models.CharField(blank=True, max_length=23, null=True)),
                ('location', models.CharField(blank=True, max_length=24, null=True)),
                ('sub_locati', models.CharField(blank=True, max_length=26, null=True)),
                ('long', models.FloatField(blank=True, null=True)),
                ('lat', models.FloatField(blank=True, null=True)),
                ('spatial_re', models.CharField(blank=True, max_length=35, null=True)),
                ('f_type', models.IntegerField(blank=True, null=True)),
                ('agency', models.CharField(blank=True, max_length=8, null=True)),
                ('geom', django.contrib.gis.db.models.fields.MultiPointField(srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='KenyaSubCounty',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ctypcode', models.CharField(max_length=254)),
                ('county', models.CharField(max_length=254)),
                ('subcounty', models.CharField(max_length=254)),
                ('geom', django.contrib.gis.db.models.fields.MultiPolygonField(srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='OutreachOfficer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tname', models.CharField(max_length=30)),
                ('status', models.CharField(max_length=20)),
                ('geom', django.contrib.gis.db.models.fields.MultiPointField(srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='Region',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('country', models.CharField(max_length=16)),
                ('region', models.CharField(max_length=50)),
                ('geom', django.contrib.gis.db.models.fields.MultiPolygonField(srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='SubLocation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('objectid', models.BigIntegerField()),
                ('locname', models.CharField(blank=True, max_length=20, null=True)),
                ('divname', models.CharField(blank=True, max_length=20, null=True)),
                ('distname', models.CharField(blank=True, max_length=20, null=True)),
                ('provname', models.CharField(blank=True, max_length=20, null=True)),
                ('code_sub', models.FloatField(blank=True, null=True)),
                ('sub_name', models.CharField(blank=True, max_length=19, null=True)),
                ('shape_leng', models.FloatField(blank=True, null=True)),
                ('shape_area', models.FloatField(blank=True, null=True)),
                ('geom', django.contrib.gis.db.models.fields.MultiPolygonField(srid=4326)),
            ],
            options={
                'verbose_name_plural': 'Sub-locations',
            },
        ),
    ]
