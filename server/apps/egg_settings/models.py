# apps/egg_settings/models.py

from django.db import models
from apps.egg_collections.models import EggCollection

class EggSetting(models.Model):
    batch_id               = models.CharField(max_length=50)
    setting_date           = models.DateField()
    collection_ids         = models.ManyToManyField(
                                EggCollection,
                                related_name="egg_settings"
                            )
    type_of_eggs           = models.CharField(max_length=50)
    full_setters           = models.PositiveIntegerField()
    unfull_setters         = models.PositiveIntegerField()
    unfull_setter_eggs     = models.PositiveIntegerField()
    eggs_set               = models.PositiveIntegerField()
    dirty_eggs             = models.PositiveIntegerField()
    damaged_eggs           = models.PositiveIntegerField()
    reject_eggs            = models.PositiveIntegerField()
    cumulative_reject_eggs = models.PositiveIntegerField()
    notes                  = models.TextField(blank=True)

    def __str__(self):
        return f"{self.batch_id} — {self.setting_date}"
