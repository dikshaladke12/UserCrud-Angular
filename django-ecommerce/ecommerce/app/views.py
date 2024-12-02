from django.http import HttpResponseForbidden
from django.shortcuts import get_object_or_404, render, redirect
from django.views import View
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User

import re
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.core.mail import send_mail
from django.utils.timezone import now
from django.conf import settings
import uuid
from datetime import timedelta
from .models import resetuuid
import datetime
from django.utils import timezone
import random
from .models import *
from django.core.paginator import Paginator
from .models import Category, Subcategory, Product
from django.contrib.auth.decorators import login_required, user_passes_test

from .models import Category, Subcategory, Product
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json



class LoginView(View):  
    def get(self, request):
        return render(request, 'login.html')

    def post(self, request):
        email = request.POST.get('email')
        password = request.POST.get('password')

        user = authenticate(request, username=email, password=password)

        if user:
            login(request, user) 
            
            if user.is_staff and user.is_superuser:
                messages.success(request, "Login successful! Redirecting to admin dashboard...")
                return redirect('/index') 
            else:
                messages.success(request, "Login successful! Redirecting to user dashboard...")
                return redirect('/user_dashboard')  
        else:
            messages.error(request, "Invalid email or password.")
            return render(request, 'login.html')


class registerView(View):
    def get(self, request):
        return render(request, 'register.html')

    def post(self, request):
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password  = request.POST.get('confirm_password')

        errors = {}
        if not all([first_name,last_name,email,password,confirm_password]):
            errors['general'] = "All fields are required."
            return render(request, 'register.html')
        
        if password != confirm_password:
            errors['confirm_password'] = "Passwords do not match."
            return render(request, 'register.html')
        
        if User.objects.filter(email=email).exists():
            errors['email'] = "A user with this email already exists."
            return render(request, 'register.html')

        if errors:
            return render(request, 'register.html', {"errors": errors})


        user = User.objects.create_user( 
            username=email,
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password
        )
        user.save()
        messages.success(request, "Registration successful! You can now log in.")
        return redirect('/')
        


class Forgotpassword(View):
    def get(self, request):
        return render(request, "forgotpassword.html")

    def post(self, request):
        email = request.POST.get("email")

        if User.objects.filter(email=email).exists():

            user = User.objects.get(email=email)
            exp_date = timezone.now() + datetime.timedelta(hours=2)
            uuid_data = uuid.uuid1(random.randint(0, 281474976710655))

            forgot = resetuuid.objects.create(
                UUID=uuid_data, user=user, expiry=exp_date
            )

            url = f"{settings.SITE_URL}/reset/{forgot.UUID}"
            print(url)
            if email:
                subject = "Password Reset Request"
                message = (
                    "To reset your password.Click the link below to get started:\n"
                    f"Rest your password\n\t{url}"
                )
                try:
                    send_mail(subject, message, settings.EMAIL_HOST_USER, [email])
                    return redirect("/")
                except Exception as e:
                    return render(request, "forgotpassword.html",)

            else:
                return render(
                    request,
                    "forgotpassword.html",
                    {"error": "failed to send the email"},
                )
        else:
            print(f"Invalid Email Address{email}")
            return render(request, "forgotpassword.html")


class Resetpassword(View):
    def get(self, request, uuid):
        context = {"uuid": uuid}
        return render(request, "Resetpassword.html", context)

    def post(self, request, uuid):
        password = request.POST.get("password")
        confirm_password = request.POST.get("confirm_password")

        current_date_time = datetime.datetime.now()

        obj = resetuuid.objects.get(UUID=uuid)
        user = obj.user
        # current_time = current_date_time.timezone('UTC')

        if password == confirm_password:
            user.set_password(password)
            user.save()
            return redirect("/")
        else:
            print("link expired")
            return redirect("/")

class logoutView(View):
    def get(self, request):
        logout(request)
        return redirect("/")



class AdminOnlyMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.is_staff or self.request.user.is_superuser
    

class AddCategoryView(LoginRequiredMixin, AdminOnlyMixin, View):
    def get(self, request):
        return render(request, "add_category.html")

    def post(self, request):
        name = request.POST.get("name")
        description = request.POST.get("description", "")

        if Category.objects.filter(name=name).exists():
            return render(request, "add_category.html", {"error": "Category already exists."})

        Category.objects.create(name=name, description=description)
        messages.success(request, "category added !")
        return redirect("/index")


class AddSubcategoryView(LoginRequiredMixin, AdminOnlyMixin, View):
    def get(self, request):
        categories = Category.objects.all()  
        return render(request, "add_subcategory.html", {"categories": categories})

    def post(self, request):
        name = request.POST.get("name")
        category_id = request.POST.get("category")
        description = request.POST.get("description", "")

        try:
            category = Category.objects.get(id=category_id)  
        except Category.DoesNotExist:
            categories = Category.objects.all()
            return render(request, "add_subcategory.html", {"categories": categories, "error": "Invalid category selected."})

    
        if Subcategory.objects.filter(name=name).exists():
            categories = Category.objects.all()
            return render(request, "add_subcategory.html", {"categories": categories, "error": "Subcategory already exists."})

        Subcategory.objects.create(name=name, category=category, description=description)
        return redirect("/index")


class AddProductView(LoginRequiredMixin, AdminOnlyMixin, View):
    def get(self, request):
        subcategories = Subcategory.objects.all()  
        return render(request, "add_products.html", {"subcategories": subcategories})

    def post(self, request):
        name = request.POST.get("name")
        subcategory_id = request.POST.get("subcategory")
        price = request.POST.get("price")
        stock = request.POST.get("stock")
        description = request.POST.get("description", "")
        image = request.FILES.get("image")  # Handle image upload

        try:
            subcategory = Subcategory.objects.get(id=subcategory_id)  # Get selected subcategory
        except Subcategory.DoesNotExist:
            subcategories = Subcategory.objects.all()
            return render(request, "add_products.html", {"subcategories": subcategories, "error": "Invalid subcategory selected."})

        Product.objects.create(
            name=name,
            subcategory=subcategory,
            price=price,
            stock=stock,
            description=description,
            image=image,
        )
        return redirect("/index")

class ProductListView(View):
    def get(self, request):
        products = Product.objects.all()
        paginator = Paginator(products, 5) 
        page_number = request.GET.get("page")
        page_obj = paginator.get_page(page_number) 

        return render(request, "index.html", {"page_obj": page_obj})


class DeleteProductView(LoginRequiredMixin, AdminOnlyMixin, View):
    def post(self, request, product_id):
        product = get_object_or_404(Product, id=product_id)
        
        product.delete()
        messages.success(request, "Product deleted successfully!")
        return redirect('/index')

class UpdateProductView(View):
    def get(self, request, product_id):
        
        product = get_object_or_404(Product, id=product_id)
        
        return render(request, 'update_product.html', {'product': product})

    def post(self, request, product_id):
        product = get_object_or_404(Product, id=product_id)

        name = request.POST.get("name")
        price = request.POST.get("price")
        stock = request.POST.get("stock")
        description = request.POST.get("description")
        image = request.FILES.get("image")  
        
        product.name = name
        product.price = price
        product.stock = stock
        product.description = description
        if image:
            product.image = image
        
        product.save()

        messages.success(request, "Product updated successfully!")
        
        return redirect('/index')


class UserDashboard(View):
    def get(self, request):
        products= Product.objects.all()
        paginator = Paginator(products, 5) 
        page_number = request.GET.get("page")
        page_obj = paginator.get_page(page_number) 

        return render(request, "user_dashboard.html", {"page_obj": page_obj})


def add_to_cart(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)

        if request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=request.user, product_id=product_id)
            cart_item, created = Cart.objects.get_or_create(cart=cart, product=product_id)
            if not created:
                cart_item.quantity += 1
                cart_item.save()
        
            cart_count = cart.items.aggregate(total_quantity=models.Sum('quantity'))['total_quantity'] or 0

            return JsonResponse({"message": "Product added to cart", "cart_count": cart_count}, status=200)
   
        else:
            return JsonResponse({'error': 'User not authenticated'}, status=401)

    return JsonResponse({'error': 'Invalid request method'}, status=400)
