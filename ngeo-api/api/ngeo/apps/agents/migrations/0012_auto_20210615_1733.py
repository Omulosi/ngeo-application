# Generated by Django 3.1.5 on 2021-06-15 17:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('agents', '0011_auto_20210615_1712'),
    ]

    operations = [
        migrations.AlterField(
            model_name='agent',
            name='id_number',
            field=models.CharField(default='233a453e-0e90-463e-8d81-373125fc2514', max_length=200, unique=True),
        ),
    ]
