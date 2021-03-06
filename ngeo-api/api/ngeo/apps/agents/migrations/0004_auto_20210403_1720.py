# Generated by Django 3.1.5 on 2021-04-03 17:20

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('finance', '0001_initial'),
        ('agents', '0003_auto_20210402_1351'),
    ]

    operations = [
        migrations.AddField(
            model_name='agent',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='agent_creator', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='agent',
            name='finance_officer',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='agents_finance', to='finance.financeofficer'),
        ),
        migrations.AddField(
            model_name='agent',
            name='reports_to',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='my_agents', to=settings.AUTH_USER_MODEL),
        ),
    ]
