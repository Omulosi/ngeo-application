# Generated by Django 3.1.5 on 2021-04-22 13:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0010_auto_20210418_0545'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='initiated_by',
            field=models.CharField(blank=True, choices=[('', ''), ('COUNTY', 'COUNTY'), ('HQ', 'HQ')], default='', max_length=10, null=True),
        ),
    ]
