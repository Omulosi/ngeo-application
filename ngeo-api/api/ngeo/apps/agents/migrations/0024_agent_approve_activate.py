# Generated by Django 3.1.5 on 2021-06-28 13:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('agents', '0023_agent_deleted_by'),
    ]

    operations = [
        migrations.AddField(
            model_name='agent',
            name='approve_activate',
            field=models.BooleanField(default=False, help_text='Designates whether a request has been sent to activate this agent. Unselect this to show the request has been handled.'),
        ),
    ]
