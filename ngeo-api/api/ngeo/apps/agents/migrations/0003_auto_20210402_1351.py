# Generated by Django 3.1.5 on 2021-04-02 13:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0001_initial'),
        ('agents', '0002_auto_20210401_2002'),
    ]

    operations = [
        migrations.AlterField(
            model_name='agent',
            name='area',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='agent_area', to='common.area'),
        ),
    ]
