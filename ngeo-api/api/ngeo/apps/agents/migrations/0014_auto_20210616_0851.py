# Generated by Django 3.1.5 on 2021-06-16 08:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('agents', '0013_auto_20210615_1737'),
    ]

    operations = [
        migrations.AlterField(
            model_name='agent',
            name='id_number',
            field=models.CharField(default='c8d0baeb-537d-4c0c-bfe4-e88806d8cec8', max_length=200, unique=True),
        ),
    ]
