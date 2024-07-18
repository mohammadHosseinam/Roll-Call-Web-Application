# utils.py
import base64
import numpy as np
import cv2
import os
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 
                                     'haarcascade_frontalface_default.xml')
def base64_to_rgb(base64_image):
    """
    Convert a base64 encoded image to an RGB image.
    
    Parameters:
    base64_image (str): The base64 encoded image string.
    
    Returns:
    np.ndarray: The RGB image array.
    """
    if "," in base64_image:
        base64_image = base64_image.split(",")[1]

    # Decode the base64 image
    image_data = base64.b64decode(base64_image)
    
    # Convert binary data to numpy array
    np_arr = np.frombuffer(image_data, np.uint8)
    
    # Convert numpy array to image
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    
    return image

def folder_address(folder_name):
    current_directory = os.getcwd() + folder_name
    return current_directory

def extract_sift_features(image):
    # Convert image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gusian = cv2.GaussianBlur(gray , (3 ,3) , 0)
    # Initialize SIFT detector
    sift = cv2.SIFT_create()
    
    # Detect keypoints and compute descriptors
    keypoints, descriptors = sift.detectAndCompute(gusian, None)
    
    return keypoints, descriptors

# Function to match keypoints between two images
def extract_canny_sift_features(image):
    # Convert image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply Gaussian blur
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)
    
    # Apply Canny edge detection
    edges = cv2.Canny(blurred, 25, 50)
    
    # Initialize SIFT detector
    sift = cv2.SIFT_create()
    
    # Detect keypoints and compute descriptors
    keypoints, descriptors = sift.detectAndCompute(edges, None)
    
    return keypoints, descriptors

def match_keypoints(descriptors1, descriptors2):
    # Initialize brute force matcher
    bf = cv2.BFMatcher()
    
    # Match descriptors of the two images
    good_matches = []
    if descriptors1 is not None and descriptors2 is not None:
        matches = bf.knnMatch(descriptors1, descriptors2, k=2)
        try:
            for m, n in matches:
                if m.distance < 0.88 * n.distance:
                    good_matches.append(m)
            return good_matches
        except:
            return good_matches
        return good_matches

def compute_similarity_score(matches, match_threshold):
    if matches is not None:
        return len(matches) / match_threshold
    return 0

# Function to compare two images using SIFT features
def compare_images(camera_image, image_path , match_threshold):
    # Extract keypoints and descriptors from both images
    user_image = cv2.imread(image_path)
    user_image_face= face_Detcted_rectangle(user_image)
    keypoints1, descriptors1 = extract_sift_features(camera_image)
    keypoints2, descriptors2 = extract_sift_features(user_image_face)
    
    # Match keypoints between the two images
    matches = match_keypoints(descriptors1, descriptors2)
    
    # If the number of matches exceeds the threshold, consider the images as similar
    similarity_score = compute_similarity_score(matches, match_threshold)
    return similarity_score

def face_Detcted_rectangle(image):
    gray_img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces_img = face_cascade.detectMultiScale(gray_img, scaleFactor=1.1,
                                          minNeighbors=7, minSize=(30, 30))
    for (x, y, h, w) in faces_img:
        cv2.rectangle(image, (x, y), (x+w, y+h), (255, 0, 0), 2)
        face_detected = image[y:y+h, x:x+w]
    return face_detected
    
def find_matched_image(camera_image, image_folder, match_threshold):
    best_match_score = 0
    best_matched_image = "Unknown"
    image_folder = folder_address(image_folder)
    for filename in os.listdir(image_folder):
        if filename.endswith(".jpg") or filename.endswith(".png"):
            matched_image_path = os.path.join(image_folder, filename)
            similarity_score = compare_images(camera_image, matched_image_path, match_threshold)
            if similarity_score > best_match_score:
                best_match_score = similarity_score
                best_matched_image = filename
    if best_match_score < 1:
        return "Unknown"
    return best_matched_image[:-4]