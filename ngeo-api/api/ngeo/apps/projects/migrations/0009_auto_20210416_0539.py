# Generated by Django 3.1.5 on 2021-04-16 05:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0008_auto_20210414_1050'),
    ]

    operations = [
        migrations.RenameField(
            model_name='project',
            old_name='county_area',
            new_name='county',
        ),
        migrations.AddField(
            model_name='project',
            name='region',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
    ]
