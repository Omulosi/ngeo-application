# Generated by Django 3.1.5 on 2021-06-08 15:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('agents', '0005_agent_deleted'),
    ]

    operations = [
        migrations.AlterField(
            model_name='agent',
            name='id_number',
            field=models.CharField(default='d960008a-1200-4af2-b555-f1eba3693715', max_length=200, unique=True),
        ),
    ]
