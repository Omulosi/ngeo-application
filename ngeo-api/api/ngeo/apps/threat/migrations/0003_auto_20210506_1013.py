# Generated by Django 3.1.5 on 2021-05-06 10:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('threat', '0002_threat_color'),
    ]

    operations = [
        migrations.AddField(
            model_name='threat',
            name='from_region',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='threat',
            name='to_region',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
