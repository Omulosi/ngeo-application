# Generated by Django 3.1.5 on 2021-06-18 17:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('themes', '0001_initial'),
        ('projects', '0019_auto_20210618_1706'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='theme',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='projects', to='themes.theme'),
        ),
    ]
