# Generated by Django 3.1.5 on 2021-04-14 10:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0007_project_county'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='county',
        ),
        migrations.AddField(
            model_name='project',
            name='county_area',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
    ]
