from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer
from django.views.decorators.csrf import csrf_exempt
import cv2
import numpy as np
import base64
from .utils import base64_to_rgb , find_matched_image
from django.utils.timezone import now
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Admin, CustomToken 
from .serializers import AdminLoginSerializer
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
import logging
import secrets

logger = logging.getLogger(__name__)
previous_frame = None
@api_view(['POST'])
def create_user(request):
    if request.method == 'POST':
        data = request.data
        serializer = UserSerializer(data=data)
        print(serializer)
        if serializer.is_valid():
            if User.objects.filter(name=data.get('name')).exists():
               return Response({'error': 'User with this name already exists.'}, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@csrf_exempt
# Global variable to store the previous frame


@api_view(['POST'])
def recognize_user(request):
    global previous_frame

    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    if request.method == 'POST':
        base64_image = request.data.get('image')
        convertedImage = base64_to_rgb(base64_image)

        # Convert the frame to grayscale
        gray = cv2.cvtColor(convertedImage, cv2.COLOR_BGR2GRAY)

        # Initialize motion detection flag
        motion_detected = False
        if previous_frame is not None:
            # Compute the absolute difference between the current frame and the previous frame
            diff = cv2.absdiff(previous_frame, gray)
            _, thresh = cv2.threshold(diff, 25, 255, cv2.THRESH_BINARY)

            # Apply some morphological operations to reduce noise
            kernel = np.ones((5, 5), np.uint8)
            thresh = cv2.dilate(thresh, kernel, iterations=2)
            contours, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
            print(f"contours : {len(contours)}.")
            # If contours are found, motion is detected
            if len(contours) > 0:
                motion_detected = True

        # Update the previous frame
        previous_frame = gray.copy()

        if motion_detected:
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
            recognized_user = False
            for (x, y, w, h) in faces:
                cv2.rectangle(convertedImage, (x, y), (x+w, y+h), (0, 255, 255), 2)
                camera_face = convertedImage[y:y+h, x:x+w]
                recognized_user = find_matched_image(camera_face, "\\media\\images", 20)
                font = cv2.FONT_HERSHEY_SIMPLEX
                cv2.putText(convertedImage, recognized_user, (x, y+h+20), font, 0.4, (0, 255, 255), 1, cv2.LINE_AA)

            message = "no face detected"
            if recognized_user != False:
                recognized_user_name = recognized_user.replace("_", " ")
                try:
                    user = User.objects.get(name=recognized_user_name)
                    print(user.last_attend)
                    user.last_attend = now()
                    print(user.last_attend)
                    user.save()
                    user1 = User.objects.get(name=recognized_user_name)
                    print(user1.last_attend)
                    message = f"welcome {recognized_user_name}"
                except User.DoesNotExist:
                    message = 'Your profile is not registered, you are not allowed to enter.'

            # Convert the processed image back to base64
            _, buffer = cv2.imencode('.jpg', convertedImage)
            jpg_as_text = base64.b64encode(buffer).decode('utf-8')
            
            return Response({"processedImage": jpg_as_text, "message": message, "faces": faces}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "No motion detected"}, status=status.HTTP_200_OK)
@csrf_exempt
@api_view(['POST'])
def admin_login(request):
    if request.method == 'POST':
        logger.debug(f"Request data: {request.data}")
        serializer = AdminLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            logger.debug(f"Validated data - Email: {email}, Password: {password}")
            try:
                admin = Admin.objects.get(email=email)
                print({admin :admin})
                print(admin.password)
                # Replace with actual password check logic, example provided
                if admin.password == password:  
                    token, created = CustomToken.objects.get_or_create(user = admin)
                    if not created:
                        token.key = secrets.token_hex(16)
                        token.save()
                    return Response({'token': token.key}, status=status.HTTP_200_OK)
                else:
                    logger.error("Invalid credentials - incorrect password")
                    return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
            except Admin.DoesNotExist:
                logger.error("Invalid credentials - admin does not exist")
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            logger.error(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
