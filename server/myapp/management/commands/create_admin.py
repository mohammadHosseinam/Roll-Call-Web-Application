# your_app/management/commands/create_admin.py

from django.core.management.base import BaseCommand
from myapp.models import Admin
from django.core.exceptions import ValidationError

class Command(BaseCommand):
    help = 'Create an Admin instance if it does not already exist'

    def handle(self, *args, **kwargs):
        if not Admin.objects.exists():
            Admin.objects.create(email='admin@gmail.com', password='1234')
            self.stdout.write(self.style.SUCCESS('Successfully created the Admin instance'))
        else:
            self.stdout.write(self.style.WARNING('An Admin instance already exists.'))
  