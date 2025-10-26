#!/usr/bin/env python3
"""
Complete Nutrient Calculator with Source Tracking
Generates meal-by-meal breakdown for all micronutrients
"""

import json

# USDA nutritional data per 100g
USDA_DATA = {
    'rolled_oats': {'vit_e': 0.7, 'vit_k': 2.0, 'vit_c': 0.0, 'folate': 56.0, 'vit_b12': 0.0, 'calcium': 54.0, 'iron': 4.7, 'zinc': 4.0, 'magnesium': 177.0, 'potassium': 429.0},
    'brown_rice_cooked': {'vit_e': 0.05, 'vit_k': 0.6, 'vit_c': 0.0, 'folate': 9.0, 'vit_b12': 0.0, 'calcium': 10.0, 'iron': 0.5, 'zinc': 0.8, 'magnesium': 43.0, 'potassium': 79.0},
    'lentils_uncooked': {'vit_e': 0.5, 'vit_k': 5.0, 'vit_c': 4.5, 'folate': 479.0, 'vit_b12': 0.0, 'calcium': 56.0, 'iron': 7.54, 'zinc': 4.78, 'magnesium': 122.0, 'potassium': 955.0},
    'chickpeas_uncooked': {'vit_e': 0.35, 'vit_k': 9.0, 'vit_c': 4.0, 'folate': 557.0, 'vit_b12': 0.0, 'calcium': 105.0, 'iron': 6.24, 'zinc': 3.43, 'magnesium': 115.0, 'potassium': 875.0},
    'black_beans_uncooked': {'vit_e': 0.87, 'vit_k': 5.6, 'vit_c': 0.0, 'folate': 444.0, 'vit_b12': 0.0, 'calcium': 123.0, 'iron': 5.02, 'zinc': 3.65, 'magnesium': 171.0, 'potassium': 1483.0},
    'chickpea_pasta_cooked': {'vit_e': 1.5, 'vit_k': 5.0, 'vit_c': 0.0, 'folate': 80.0, 'vit_b12': 0.0, 'calcium': 20.0, 'iron': 3.0, 'zinc': 1.5, 'magnesium': 50.0, 'potassium': 200.0},
    'walnuts': {'vit_e': 0.7, 'vit_k': 2.7, 'vit_c': 1.3, 'folate': 98.0, 'vit_b12': 0.0, 'calcium': 98.0, 'iron': 2.91, 'zinc': 3.09, 'magnesium': 158.0, 'potassium': 441.0},
    'almonds': {'vit_e': 25.6, 'vit_k': 0.0, 'vit_c': 0.0, 'folate': 50.0, 'vit_b12': 0.0, 'calcium': 264.0, 'iron': 3.7, 'zinc': 3.1, 'magnesium': 270.0, 'potassium': 705.0},
    'peanut_butter': {'vit_e': 9.1, 'vit_k': 0.3, 'vit_c': 0.0, 'folate': 86.0, 'vit_b12': 0.0, 'calcium': 49.0, 'iron': 1.7, 'zinc': 2.54, 'magnesium': 169.0, 'potassium': 564.0},
    'chia_seeds': {'vit_e': 0.5, 'vit_k': 0.0, 'vit_c': 1.6, 'folate': 49.0, 'vit_b12': 0.0, 'calcium': 631.0, 'iron': 7.7, 'zinc': 4.6, 'magnesium': 335.0, 'potassium': 407.0},
    'egg_large': {'vit_e': 1.1, 'vit_k': 0.3, 'vit_c': 0.0, 'folate': 47.0, 'vit_b12': 1.0, 'calcium': 56.0, 'iron': 1.8, 'zinc': 1.3, 'magnesium': 12.0, 'potassium': 138.0},
    'greek_yogurt_2pct': {'vit_e': 0.1, 'vit_k': 0.3, 'vit_c': 0.0, 'folate': 7.0, 'vit_b12': 0.4, 'calcium': 100.0, 'iron': 0.05, 'zinc': 0.5, 'magnesium': 10.0, 'potassium': 141.0},
    'milk_2pct': {'vit_e': 0.1, 'vit_k': 0.3, 'vit_c': 0.0, 'folate': 5.0, 'vit_b12': 0.5, 'calcium': 124.0, 'iron': 0.0, 'zinc': 0.4, 'magnesium': 11.0, 'potassium': 140.0},
    'whey_protein': {'vit_e': 0.0, 'vit_k': 0.0, 'vit_c': 0.0, 'folate': 0.0, 'vit_b12': 0.0, 'calcium': 453.0, 'iron': 0.54, 'zinc': 0.42, 'magnesium': 45.0, 'potassium': 161.0},
    'tofu_firm': {'vit_e': 0.0, 'vit_k': 2.4, 'vit_c': 0.0, 'folate': 15.0, 'vit_b12': 0.0, 'calcium': 350.0, 'iron': 2.7, 'zinc': 1.0, 'magnesium': 63.0, 'potassium': 121.0},
    'spinach': {'vit_e': 2.0, 'vit_k': 482.9, 'vit_c': 28.1, 'folate': 194.0, 'vit_b12': 0.0, 'calcium': 99.0, 'iron': 2.7, 'zinc': 0.5, 'magnesium': 79.0, 'potassium': 558.0},
    'mushrooms': {'vit_e': 0.0, 'vit_k': 1.0, 'vit_c': 2.1, 'folate': 17.0, 'vit_b12': 0.0, 'calcium': 3.0, 'iron': 0.5, 'zinc': 0.5, 'magnesium': 9.0, 'potassium': 318.0},
    'kale': {'vit_e': 1.54, 'vit_k': 390.0, 'vit_c': 120.0, 'folate': 141.0, 'vit_b12': 0.0, 'calcium': 150.0, 'iron': 1.5, 'zinc': 0.6, 'magnesium': 47.0, 'potassium': 491.0},
    'broccoli': {'vit_e': 0.8, 'vit_k': 102.0, 'vit_c': 89.2, 'folate': 63.0, 'vit_b12': 0.0, 'calcium': 47.0, 'iron': 0.7, 'zinc': 0.4, 'magnesium': 21.0, 'potassium': 316.0},
    'okra': {'vit_e': 0.4, 'vit_k': 31.3, 'vit_c': 23.0, 'folate': 60.0, 'vit_b12': 0.0, 'calcium': 82.0, 'iron': 0.6, 'zinc': 0.6, 'magnesium': 57.0, 'potassium': 299.0},
    'potato': {'vit_e': 0.01, 'vit_k': 2.0, 'vit_c': 19.7, 'folate': 16.0, 'vit_b12': 0.0, 'calcium': 12.0, 'iron': 0.8, 'zinc': 0.3, 'magnesium': 23.0, 'potassium': 425.0},
    'mixed_veg': {'vit_e': 0.5, 'vit_k': 10.0, 'vit_c': 10.0, 'folate': 30.0, 'vit_b12': 0.0, 'calcium': 40.0, 'iron': 0.8, 'zinc': 0.3, 'magnesium': 20.0, 'potassium': 200.0},
    'banana': {'vit_e': 0.1, 'vit_k': 0.5, 'vit_c': 8.7, 'folate': 20.0, 'vit_b12': 0.0, 'calcium': 5.0, 'iron': 0.3, 'zinc': 0.2, 'magnesium': 27.0, 'potassium': 358.0},
    'apple': {'vit_e': 0.2, 'vit_k': 2.2, 'vit_c': 4.6, 'folate': 3.0, 'vit_b12': 0.0, 'calcium': 6.0, 'iron': 0.1, 'zinc': 0.04, 'magnesium': 5.0, 'potassium': 107.0},
    'pomegranate': {'vit_e': 0.6, 'vit_k': 16.4, 'vit_c': 10.2, 'folate': 38.0, 'vit_b12': 0.0, 'calcium': 10.0, 'iron': 0.3, 'zinc': 0.4, 'magnesium': 12.0, 'potassium': 236.0},
    'nutritional_yeast': {'vit_e': 0.0, 'vit_k': 0.0, 'vit_c': 0.0, 'folate': 3125.0, 'vit_b12': 150.0, 'calcium': 20.0, 'iron': 5.0, 'zinc': 12.5, 'magnesium': 40.0, 'potassium': 900.0},
    'olive_oil': {'vit_e': 14.4, 'vit_k': 60.2, 'vit_c': 0.0, 'folate': 0.0, 'vit_b12': 0.0, 'calcium': 1.0, 'iron': 0.0, 'zinc': 0.0, 'magnesium': 0.0, 'potassium': 1.0},
    'chapati': {'vit_e': 0.5, 'vit_k': 1.0, 'vit_c': 0.0, 'folate': 50.0, 'vit_b12': 0.0, 'calcium': 15.0, 'iron': 2.7, 'zinc': 0.9, 'magnesium': 28.0, 'potassium': 120.0},
    'veg_fried_rice': {'vit_e': 1.14, 'vit_k': 25.1, 'vit_c': 2.5, 'folate': 22.0, 'vit_b12': 0.0, 'calcium': 22.0, 'iron': 0.69, 'zinc': 0.49, 'magnesium': 16.0, 'potassium': 111.0},
}

PORTIONS = {
    '1c_oats': 80, '3/4c_oats': 60,
    '1c_rice': 195, '0.5c_rice': 97.5, '1.5c_rice': 292.5, '2c_rice': 390, '2.5c_rice': 487.5, '3.5c_rice': 682.5,
    '1/4c_walnuts': 30, '1/2c_walnuts': 60,
    '1/8c_almonds': 18, '1/4c_almonds': 36, '1/2c_almonds': 72,
    '1tbsp_pb': 16, '2tbsp_pb': 32,
    '1tbsp_chia': 10, '1_scoop_whey': 22,
    '1c_lentils': 192, '1c_chickpeas': 200, '1c_black_beans': 194,
    '1c_pasta': 140, '1.5c_pasta': 210, '2c_pasta': 280, '2.5c_pasta': 350,
    '6_eggs': 300, '1c_yogurt': 227, '1c_milk': 244,
    '2c_spinach': 60, '1c_mushrooms': 70, '1c_kale': 67, '1.5c_broccoli': 135, '1c_okra': 100, '2_potatoes': 400,
    '1_banana': 120, '1_apple': 180, '1c_pomegranate': 174,
    '1tbsp_yeast': 8, '1tbsp_oil': 14, '0.5tbsp_oil': 7,
    '200g_tofu': 200, '1_chapati': 60, '3_chapati': 180, '2_chapati': 120,
    '1c_fried_rice': 200, '2c_fried_rice': 400, '2.5c_fried_rice': 500, '3c_fried_rice': 600,
    '1.5c_mixed_veg': 225,
}

# Meal names for source tracking
MEAL_NAMES = {
    'breakfast': 'Breakfast',
    'lunch': 'Lunch',
    'snack1': 'Snack 1',
    'dinner': 'Dinner',
    'snack2': 'Snack 2',
    'snack3': 'Snack 3'
}

DV = {'vit_d': 20.0, 'vit_e': 15.0, 'vit_k': 120.0, 'vit_c': 90.0, 'folate': 400.0, 'vit_b12': 2.4, 'calcium': 1300.0, 'iron': 18.0, 'zinc': 11.0, 'magnesium': 420.0, 'potassium': 4700.0}

def calc(food, portion_key, nutrient):
    """Calculate nutrient for given food and portion"""
    if food not in USDA_DATA or portion_key not in PORTIONS:
        return 0.0
    portion_g = PORTIONS[portion_key]
    value_per_100g = USDA_DATA[food].get(nutrient, 0.0)
    return (value_per_100g * portion_g) / 100.0

def calc_meal(ingredients, nutrient):
    """Calculate total nutrient for a meal"""
    return sum(calc(food, portion, nutrient) for food, portion in ingredients)

def calc_day_with_sources(meals, day_num):
    """Calculate all micronutrients with meal-by-meal source tracking"""
    result = {}
    
    # Vitamin D is always from supplement
    result['vitaminD'] = {'value': 20.0, 'percentage': 100, 'sources': [{'meal': 'Supplement', 'value': 20.0}]}
    
    # Calculate all other nutrients with sources
    nutrients = ['vit_e', 'vit_k', 'vit_c', 'folate', 'vit_b12', 'calcium', 'iron', 'zinc', 'magnesium', 'potassium']
    nutrient_keys = ['vitaminE', 'vitaminK', 'vitaminC', 'folate', 'vitaminB12', 'calcium', 'iron', 'zinc', 'magnesium', 'potassium']
    
    for nutrient, key in zip(nutrients, nutrient_keys):
        total = 0.0
        sources = []
        
        for meal_id, ingredients in meals.items():
            if ingredients:  # Skip empty meals
                meal_value = calc_meal(ingredients, nutrient)
                if meal_value > 0.1:  # Only include significant sources
                    sources.append({'meal': MEAL_NAMES[meal_id], 'value': round(meal_value, 1)})
                    total += meal_value
        
        result[key] = {
            'value': round(total, 1),
            'percentage': round((total / DV[nutrient]) * 100),
            'sources': sources
        }
    
    return result

# Define all meal plans
bulking_meals = {
    1: {
        'breakfast': [('rolled_oats', '1c_oats'), ('whey_protein', '1_scoop_whey'), ('chia_seeds', '1tbsp_chia'), ('walnuts', '1/4c_walnuts')],
        'lunch': [('lentils_uncooked', '1c_lentils'), ('brown_rice_cooked', '3.5c_rice'), ('olive_oil', '1tbsp_oil')],
        'snack1': [('greek_yogurt_2pct', '1c_yogurt'), ('banana', '1_banana'), ('peanut_butter', '1tbsp_pb')],
        'dinner': [('potato', '2_potatoes'), ('kale', '1c_kale'), ('okra', '1c_okra'), ('olive_oil', '0.5tbsp_oil')],
        'snack2': [('almonds', '1/4c_almonds')],
        'snack3': [('greek_yogurt_2pct', '1c_yogurt'), ('nutritional_yeast', '1tbsp_yeast')]
    },
    2: {
        'breakfast': [('egg_large', '6_eggs'), ('spinach', '2c_spinach'), ('mushrooms', '1c_mushrooms'), ('olive_oil', '1tbsp_oil')],
        'lunch': [('chickpeas_uncooked', '1c_chickpeas'), ('chapati', '3_chapati'), ('olive_oil', '1tbsp_oil')],
        'snack1': [('greek_yogurt_2pct', '1c_yogurt'), ('pomegranate', '1c_pomegranate'), ('peanut_butter', '1tbsp_pb')],
        'dinner': [('chickpea_pasta_cooked', '2.5c_pasta'), ('mixed_veg', '1.5c_mixed_veg'), ('olive_oil', '1tbsp_oil')],
        'snack2': [('whey_protein', '1_scoop_whey'), ('milk_2pct', '1c_milk')],
        'snack3': [('almonds', '1/4c_almonds')]
    },
    3: {
        'breakfast': [('rolled_oats', '1c_oats'), ('whey_protein', '1_scoop_whey'), ('chia_seeds', '1tbsp_chia'), ('walnuts', '1/4c_walnuts')],
        'lunch': [('black_beans_uncooked', '1c_black_beans'), ('brown_rice_cooked', '2c_rice'), ('olive_oil', '1tbsp_oil')],
        'snack1': [('apple', '1_apple'), ('peanut_butter', '1tbsp_pb')],
        'dinner': [('tofu_firm', '200g_tofu'), ('brown_rice_cooked', '2c_rice'), ('broccoli', '1.5c_broccoli'), ('olive_oil', '1tbsp_oil'), ('nutritional_yeast', '1tbsp_yeast')],
        'snack2': [('almonds', '1/4c_almonds')],
        'snack3': []
    },
    4: {
        'breakfast': [('egg_large', '6_eggs'), ('spinach', '2c_spinach'), ('mushrooms', '1c_mushrooms'), ('olive_oil', '1tbsp_oil')],
        'lunch': [('lentils_uncooked', '1c_lentils'), ('brown_rice_cooked', '2.5c_rice'), ('olive_oil', '1tbsp_oil')],
        'snack1': [('greek_yogurt_2pct', '1c_yogurt'), ('banana', '1_banana'), ('almonds', '1/4c_almonds'), ('peanut_butter', '1tbsp_pb')],
        'dinner': [('veg_fried_rice', '3c_fried_rice'), ('olive_oil', '1tbsp_oil')],
        'snack2': [('whey_protein', '1_scoop_whey'), ('milk_2pct', '1c_milk')],
        'snack3': []
    },
    5: {
        'breakfast': [('rolled_oats', '1c_oats'), ('whey_protein', '1_scoop_whey'), ('chia_seeds', '1tbsp_chia'), ('walnuts', '1/4c_walnuts')],
        'lunch': [('lentils_uncooked', '1c_lentils'), ('brown_rice_cooked', '3.5c_rice'), ('olive_oil', '1tbsp_oil')],
        'snack1': [('apple', '1_apple'), ('walnuts', '1/4c_walnuts'), ('peanut_butter', '1tbsp_pb')],
        'dinner': [('chickpea_pasta_cooked', '2c_pasta'), ('mixed_veg', '1.5c_mixed_veg'), ('kale', '1c_kale'), ('olive_oil', '1tbsp_oil'), ('nutritional_yeast', '1tbsp_yeast')],
        'snack2': [('greek_yogurt_2pct', '1c_yogurt')],
        'snack3': []
    },
    6: {
        'breakfast': [('egg_large', '6_eggs'), ('spinach', '2c_spinach'), ('mushrooms', '1c_mushrooms'), ('olive_oil', '1tbsp_oil')],
        'lunch': [('chickpeas_uncooked', '1c_chickpeas'), ('chapati', '3_chapati'), ('olive_oil', '1tbsp_oil')],
        'snack1': [('greek_yogurt_2pct', '1c_yogurt'), ('pomegranate', '1c_pomegranate')],
        'dinner': [('tofu_firm', '200g_tofu'), ('brown_rice_cooked', '2.5c_rice'), ('olive_oil', '1tbsp_oil')],
        'snack2': [('almonds', '1/4c_almonds')],
        'snack3': []
    },
    7: {
        'breakfast': [('rolled_oats', '1c_oats'), ('whey_protein', '1_scoop_whey'), ('chia_seeds', '1tbsp_chia'), ('walnuts', '1/4c_walnuts')],
        'lunch': [('black_beans_uncooked', '1c_black_beans'), ('brown_rice_cooked', '2c_rice'), ('olive_oil', '1tbsp_oil')],
        'snack1': [('apple', '1_apple'), ('peanut_butter', '1tbsp_pb')],
        'dinner': [('veg_fried_rice', '2.5c_fried_rice'), ('broccoli', '1.5c_broccoli'), ('olive_oil', '1tbsp_oil'), ('nutritional_yeast', '1tbsp_yeast')],
        'snack2': [('almonds', '1/4c_almonds')],
        'snack3': []
    }
}

# Define cutting phase meals (adjusted portions)
cutting_meals = {
    1: {
        'breakfast': [('rolled_oats', '3/4c_oats'), ('whey_protein', '1_scoop_whey'), ('chia_seeds', '1tbsp_chia'), ('walnuts', '1/2c_walnuts')],
        'lunch': [('lentils_uncooked', '1c_lentils'), ('brown_rice_cooked', '2c_rice'), ('olive_oil', '0.5tbsp_oil')],
        'snack1': [('greek_yogurt_2pct', '1c_yogurt'), ('banana', '1_banana'), ('peanut_butter', '1tbsp_pb')],
        'dinner': [('potato', '2_potatoes'), ('kale', '1c_kale'), ('okra', '1c_okra'), ('olive_oil', '0.5tbsp_oil'), ('nutritional_yeast', '1tbsp_yeast')],
        'snack2': [('almonds', '1/2c_almonds')],
        'snack3': []
    },
    2: {
        'breakfast': [('egg_large', '6_eggs'), ('spinach', '2c_spinach'), ('mushrooms', '1c_mushrooms'), ('olive_oil', '0.5tbsp_oil')],
        'lunch': [('chickpeas_uncooked', '1c_chickpeas'), ('chapati', '2_chapati'), ('olive_oil', '0.5tbsp_oil')],
        'snack1': [('greek_yogurt_2pct', '1c_yogurt'), ('pomegranate', '1c_pomegranate')],
        'dinner': [('chickpea_pasta_cooked', '1.5c_pasta'), ('mixed_veg', '1.5c_mixed_veg'), ('olive_oil', '0.5tbsp_oil')],
        'snack2': [('whey_protein', '1_scoop_whey'), ('milk_2pct', '1c_milk')],
        'snack3': []
    },
    3: {
        'breakfast': [('rolled_oats', '3/4c_oats'), ('whey_protein', '1_scoop_whey'), ('chia_seeds', '1tbsp_chia'), ('walnuts', '1/2c_walnuts')],
        'lunch': [('black_beans_uncooked', '1c_black_beans'), ('brown_rice_cooked', '1.5c_rice'), ('olive_oil', '0.5tbsp_oil')],
        'snack1': [('apple', '1_apple'), ('peanut_butter', '1tbsp_pb')],
        'dinner': [('tofu_firm', '200g_tofu'), ('brown_rice_cooked', '1c_rice'), ('broccoli', '1.5c_broccoli'), ('olive_oil', '0.5tbsp_oil'), ('nutritional_yeast', '1tbsp_yeast')],
        'snack2': [('almonds', '1/2c_almonds')],
        'snack3': []
    },
    4: {
        'breakfast': [('egg_large', '6_eggs'), ('spinach', '2c_spinach'), ('mushrooms', '1c_mushrooms'), ('olive_oil', '0.5tbsp_oil')],
        'lunch': [('lentils_uncooked', '1c_lentils'), ('brown_rice_cooked', '1.5c_rice'), ('olive_oil', '0.5tbsp_oil')],
        'snack1': [('greek_yogurt_2pct', '1c_yogurt'), ('banana', '1_banana'), ('peanut_butter', '1tbsp_pb')],
        'dinner': [('veg_fried_rice', '2.5c_fried_rice'), ('olive_oil', '0.5tbsp_oil')],
        'snack2': [('whey_protein', '1_scoop_whey'), ('milk_2pct', '1c_milk')],
        'snack3': []
    },
    5: {
        'breakfast': [('rolled_oats', '3/4c_oats'), ('whey_protein', '1_scoop_whey'), ('chia_seeds', '1tbsp_chia'), ('walnuts', '1/2c_walnuts')],
        'lunch': [('lentils_uncooked', '1c_lentils'), ('brown_rice_cooked', '2c_rice'), ('olive_oil', '0.5tbsp_oil')],
        'snack1': [('apple', '1_apple'), ('walnuts', '1/4c_walnuts')],
        'dinner': [('chickpea_pasta_cooked', '2c_pasta'), ('mixed_veg', '1.5c_mixed_veg'), ('kale', '1c_kale'), ('olive_oil', '0.5tbsp_oil'), ('nutritional_yeast', '1tbsp_yeast')],
        'snack2': [('greek_yogurt_2pct', '1c_yogurt')],
        'snack3': []
    },
    6: {
        'breakfast': [('egg_large', '6_eggs'), ('spinach', '2c_spinach'), ('mushrooms', '1c_mushrooms'), ('olive_oil', '0.5tbsp_oil')],
        'lunch': [('chickpeas_uncooked', '1c_chickpeas'), ('chapati', '2_chapati'), ('olive_oil', '0.5tbsp_oil')],
        'snack1': [('greek_yogurt_2pct', '1c_yogurt'), ('pomegranate', '1c_pomegranate')],
        'dinner': [('tofu_firm', '200g_tofu'), ('brown_rice_cooked', '1.5c_rice'), ('olive_oil', '0.5tbsp_oil')],
        'snack2': [],
        'snack3': []
    },
    7: {
        'breakfast': [('rolled_oats', '3/4c_oats'), ('whey_protein', '1_scoop_whey'), ('chia_seeds', '1tbsp_chia'), ('walnuts', '1/2c_walnuts')],
        'lunch': [('black_beans_uncooked', '1c_black_beans'), ('brown_rice_cooked', '1.5c_rice'), ('olive_oil', '0.5tbsp_oil')],
        'snack1': [('apple', '1_apple'), ('peanut_butter', '1tbsp_pb')],
        'dinner': [('veg_fried_rice', '2c_fried_rice'), ('broccoli', '1.5c_broccoli'), ('olive_oil', '0.5tbsp_oil'), ('nutritional_yeast', '1tbsp_yeast')],
        'snack2': [('almonds', '1/2c_almonds')],
        'snack3': []
    }
}

# Calculate and generate TypeScript-ready JSON
print("Calculating all micronutrients with source tracking...")
print("=" * 80)

results = {'bulking': {}, 'cutting': {}}

print("\n=== BULKING PHASE ===")
for day in range(1, 8):
    print(f"Day {day}...")
    results['bulking'][day] = calc_day_with_sources(bulking_meals[day], day)
print(results['bulking'][1])
print("\n=== CUTTING PHASE ===")
for day in range(1, 8):
    print(f"Day {day}...")
    results['cutting'][day] = calc_day_with_sources(cutting_meals[day], day)

print("\n\n" + "=" * 80)
print("FORMATTED JSON OUTPUT FOR page.tsx:")
print("=" * 80)
print("\n// Replace the existing micronutrientData object with this:\n")
print("const micronutrientData = " + json.dumps(results, indent=2) + ";\n")

print("\n" + "=" * 80)
print("Complete! Copy the above JSON into your page.tsx file.")
print("=" * 80)

