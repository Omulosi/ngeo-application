# Generated by Django 3.1.5 on 2021-07-04 14:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('field_officer', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fieldofficer',
            name='user',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='field_officer', to=settings.AUTH_USER_MODEL),
        ),
    ]
