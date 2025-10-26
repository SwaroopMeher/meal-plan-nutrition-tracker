#!/usr/bin/env python3
"""
Micronutrient Calculator for Updated Meal Plans
Based on USDA FoodData Central values and modifications from recommendations
"""

# USDA nutritional data per 100g (from Comprehensive Micronutrient Analysis document)
USDA_DATA = {
    # Grains and Legumes (per 100g uncooked)
    'rolled_oats': {'vit_e': 0.7, 'vit_k': 2.0, 'vit_c': 0.0, 'folate': 56.0, 'vit_b12': 0.0, 
                    'calcium': 54.0, 'iron': 4.7, 'zinc': 4.0, 'magnesium': 177.0, 'potassium': 429.0},
    'brown_rice_cooked': {'vit_e': 0.05, 'vit_k': 0.6, 'vit_c': 0.0, 'folate': 9.0, 'vit_b12': 0.0,
                          'calcium': 10.0, 'iron': 0.5, 'zinc': 0.8, 'magnesium': 43.0, 'potassium': 79.0},
    'lentils_uncooked': {'vit_e': 0.5, 'vit_k': 5.0, 'vit_c': 4.5, 'folate': 479.0, 'vit_b12': 0.0,
                         'calcium': 56.0, 'iron': 7.5, 'zinc': 4.8, 'magnesium': 122.0, 'potassium': 677.0},
    'chickpeas_uncooked': {'vit_e': 2.9, 'vit_k': 9.0, 'vit_c': 4.0, 'folate': 557.0, 'vit_b12': 0.0,
                           'calcium': 105.0, 'iron': 6.2, 'zinc': 3.4, 'magnesium': 115.0, 'potassium': 875.0},
    'black_beans_uncooked': {'vit_e': 0.9, 'vit_k': 5.0, 'vit_c': 0.0, 'folate': 444.0, 'vit_b12': 0.0,
                             'calcium': 123.0, 'iron': 8.0, 'zinc': 3.6, 'magnesium': 171.0, 'potassium': 1483.0},
    'chickpea_pasta_cooked': {'vit_e': 1.5, 'vit_k': 5.0, 'vit_c': 0.0, 'folate': 80.0, 'vit_b12': 0.0,
                              'calcium': 20.0, 'iron': 3.0, 'zinc': 1.5, 'magnesium': 50.0, 'potassium': 200.0},
    
    # Nuts and Seeds (per 100g)
    'walnuts': {'vit_e': 15.0, 'vit_k': 2.7, 'vit_c': 1.3, 'folate': 98.0, 'vit_b12': 0.0,
                'calcium': 98.0, 'iron': 2.9, 'zinc': 3.1, 'magnesium': 158.0, 'potassium': 441.0},
    'almonds': {'vit_e': 25.6, 'vit_k': 0.0, 'vit_c': 0.0, 'folate': 50.0, 'vit_b12': 0.0,
                'calcium': 264.0, 'iron': 3.7, 'zinc': 3.1, 'magnesium': 270.0, 'potassium': 705.0},
    'peanut_butter': {'vit_e': 9.1, 'vit_k': 0.0, 'vit_c': 0.0, 'folate': 92.0, 'vit_b12': 0.0,
                      'calcium': 49.0, 'iron': 2.2, 'zinc': 2.7, 'magnesium': 179.0, 'potassium': 649.0},
    'chia_seeds': {'vit_e': 0.5, 'vit_k': 0.0, 'vit_c': 1.6, 'folate': 49.0, 'vit_b12': 0.0,
                   'calcium': 631.0, 'iron': 7.7, 'zinc': 4.6, 'magnesium': 335.0, 'potassium': 407.0},
    
    # Animal Products and Dairy (per 100g)
    'egg_large': {'vit_e': 1.1, 'vit_k': 0.3, 'vit_c': 0.0, 'folate': 47.0, 'vit_b12': 1.0,
                  'calcium': 56.0, 'iron': 1.8, 'zinc': 1.3, 'magnesium': 12.0, 'potassium': 138.0},  # per 100g
    'greek_yogurt_2pct': {'vit_e': 0.1, 'vit_k': 0.3, 'vit_c': 0.0, 'folate': 7.0, 'vit_b12': 0.4,
                          'calcium': 100.0, 'iron': 0.05, 'zinc': 0.5, 'magnesium': 10.0, 'potassium': 141.0},
    'milk_2pct': {'vit_e': 0.1, 'vit_k': 0.3, 'vit_c': 0.0, 'folate': 5.0, 'vit_b12': 0.5,
                  'calcium': 124.0, 'iron': 0.0, 'zinc': 0.4, 'magnesium': 11.0, 'potassium': 140.0},
    'whey_protein': {'vit_e': 0.0, 'vit_k': 0.0, 'vit_c': 0.0, 'folate': 0.0, 'vit_b12': 0.5,
                     'calcium': 50.0, 'iron': 0.0, 'zinc': 0.0, 'magnesium': 0.0, 'potassium': 50.0},
    'tofu_firm': {'vit_e': 0.0, 'vit_k': 2.4, 'vit_c': 0.0, 'folate': 15.0, 'vit_b12': 0.0,
                  'calcium': 350.0, 'iron': 2.7, 'zinc': 1.0, 'magnesium': 63.0, 'potassium': 121.0},
    
    # Vegetables (per 100g raw)
    'spinach': {'vit_e': 2.0, 'vit_k': 482.9, 'vit_c': 28.1, 'folate': 194.0, 'vit_b12': 0.0,
                'calcium': 99.0, 'iron': 2.7, 'zinc': 0.5, 'magnesium': 79.0, 'potassium': 558.0},
    'mushrooms': {'vit_e': 0.0, 'vit_k': 1.0, 'vit_c': 2.1, 'folate': 17.0, 'vit_b12': 0.0,
                  'calcium': 3.0, 'iron': 0.5, 'zinc': 0.5, 'magnesium': 9.0, 'potassium': 318.0},
    'kale': {'vit_e': 1.5, 'vit_k': 390.0, 'vit_c': 93.0, 'folate': 57.0, 'vit_b12': 0.0,
             'calcium': 150.0, 'iron': 1.5, 'zinc': 0.4, 'magnesium': 34.0, 'potassium': 348.0},
    'broccoli': {'vit_e': 0.8, 'vit_k': 102.0, 'vit_c': 89.2, 'folate': 63.0, 'vit_b12': 0.0,
                 'calcium': 47.0, 'iron': 0.7, 'zinc': 0.4, 'magnesium': 21.0, 'potassium': 316.0},
    'okra': {'vit_e': 0.4, 'vit_k': 31.3, 'vit_c': 23.0, 'folate': 60.0, 'vit_b12': 0.0,
             'calcium': 82.0, 'iron': 0.6, 'zinc': 0.6, 'magnesium': 57.0, 'potassium': 299.0},
    'potato': {'vit_e': 0.01, 'vit_k': 2.0, 'vit_c': 19.7, 'folate': 16.0, 'vit_b12': 0.0,
               'calcium': 12.0, 'iron': 0.8, 'zinc': 0.3, 'magnesium': 23.0, 'potassium': 425.0},
    'mixed_veg': {'vit_e': 0.5, 'vit_k': 10.0, 'vit_c': 10.0, 'folate': 30.0, 'vit_b12': 0.0,
                  'calcium': 40.0, 'iron': 0.8, 'zinc': 0.3, 'magnesium': 20.0, 'potassium': 200.0},
    
    # Fruits
    'banana': {'vit_e': 0.1, 'vit_k': 0.5, 'vit_c': 8.7, 'folate': 20.0, 'vit_b12': 0.0,
               'calcium': 5.0, 'iron': 0.3, 'zinc': 0.2, 'magnesium': 27.0, 'potassium': 358.0},
    'apple': {'vit_e': 0.2, 'vit_k': 2.2, 'vit_c': 4.6, 'folate': 3.0, 'vit_b12': 0.0,
              'calcium': 6.0, 'iron': 0.1, 'zinc': 0.04, 'magnesium': 5.0, 'potassium': 107.0},
    'pomegranate': {'vit_e': 0.6, 'vit_k': 16.4, 'vit_c': 10.2, 'folate': 38.0, 'vit_b12': 0.0,
                    'calcium': 10.0, 'iron': 0.3, 'zinc': 0.4, 'magnesium': 12.0, 'potassium': 236.0},
    
    # Supplements and Other
    'nutritional_yeast': {'vit_e': 0.0, 'vit_k': 0.0, 'vit_c': 0.0, 'folate': 31250.0, 'vit_b12': 150.0,  # per 100g
                          'calcium': 20.0, 'iron': 5.0, 'zinc': 12.5, 'magnesium': 40.0, 'potassium': 900.0},
    'olive_oil': {'vit_e': 14.4, 'vit_k': 60.2, 'vit_c': 0.0, 'folate': 0.0, 'vit_b12': 0.0,
                  'calcium': 1.0, 'iron': 0.0, 'zinc': 0.0, 'magnesium': 0.0, 'potassium': 1.0},
    'lemon': {'vit_e': 0.2, 'vit_k': 0.0, 'vit_c': 53.0, 'folate': 11.0, 'vit_b12': 0.0,
              'calcium': 26.0, 'iron': 0.6, 'zinc': 0.1, 'magnesium': 8.0, 'potassium': 138.0},
}

# Standard portions
PORTIONS = {
    '1c_oats': 80,  # 1 cup dry oats = 80g
    '3/4c_oats': 60,
    '1c_rice_cooked': 195,  # 1 cup cooked rice
    '0.5c_rice_cooked': 97.5,
    '1.5c_rice_cooked': 292.5,
    '2c_rice_cooked': 390,
    '2.5c_rice_cooked': 487.5,
    '3.5c_rice_cooked': 682.5,
    '1/4c_walnuts': 30,
    '1/2c_walnuts': 60,
    '1/4c_almonds': 36,
    '1/2c_almonds': 72,
    '1/8c_almonds': 18,
    '1tbsp_pb': 16,
    '2tbsp_pb': 32,
    '1tbsp_chia': 12,
    '1_scoop_whey': 22,
    '1c_lentils_uncooked': 192,  # makes about 2 cups cooked
    '1c_chickpeas_uncooked': 200,
    '1c_black_beans_uncooked': 194,
    '1c_chickpea_pasta_cooked': 140,
    '1.5c_chickpea_pasta_cooked': 210,
    '2c_chickpea_pasta_cooked': 280,
    '2.5c_chickpea_pasta_cooked': 350,
    '6_eggs': 300,  # 6 large eggs ≈ 300g
    '1c_greek_yogurt': 227,
    '1c_milk': 244,
    '2c_spinach': 60,
    '1c_mushrooms': 70,
    '1c_kale': 67,
    '1.5c_broccoli': 135,
    '1c_okra': 100,
    '2_potatoes': 400,
    '1_banana': 120,
    '1_apple': 180,
    '1c_pomegranate': 87,
    '1tbsp_nutritional_yeast': 8,
    '1tbsp_olive_oil': 14,
    '1/2tbsp_olive_oil': 7,
    '200g_tofu': 200,
    '1_lemon_wedge': 10,
}

def calculate_nutrient(food, portion_g, nutrient):
    """Calculate nutrient amount for given portion"""
    if food not in USDA_DATA:
        return 0.0
    value_per_100g = USDA_DATA[food].get(nutrient, 0.0)
    return (value_per_100g * portion_g) / 100.0

def calculate_meal(ingredients, nutrient):
    """Calculate total nutrient for a meal"""
    total = 0.0
    for food, portion_key in ingredients:
        portion_g = PORTIONS.get(portion_key, 0)
        total += calculate_nutrient(food, portion_g, nutrient)
    return total

# Daily Value (DV) benchmarks
DV = {
    'vit_d': 20.0,  # mcg
    'vit_e': 15.0,  # mg
    'vit_k': 120.0,  # mcg
    'vit_c': 90.0,  # mg
    'folate': 400.0,  # mcg
    'vit_b12': 2.4,  # mcg
    'calcium': 1300.0,  # mg
    'iron': 18.0,  # mg
    'zinc': 11.0,  # mg
    'magnesium': 420.0,  # mg
    'potassium': 4700.0,  # mg
}

# BULKING PHASE MEALS (Updated with modifications)
bulking_meals = {
    1: {
        'breakfast': [
            ('rolled_oats', '1c_oats'),
            ('whey_protein', '1_scoop_whey'),
            ('chia_seeds', '1tbsp_chia'),
            ('walnuts', '1/4c_walnuts'),  # REDUCED from 1/2c
        ],
        'lunch': [
            ('lentils_uncooked', '1c_lentils_uncooked'),
            ('brown_rice_cooked', '3.5c_rice_cooked'),  # INCREASED from 2.5c
            ('olive_oil', '1tbsp_olive_oil'),
            ('lemon', '1_lemon_wedge'),
        ],
        'snack1': [
            ('greek_yogurt_2pct', '1c_greek_yogurt'),
            ('banana', '1_banana'),
            ('peanut_butter', '1tbsp_pb'),  # REDUCED from 2tbsp
        ],
        'dinner': [
            ('potato', '2_potatoes'),
            ('kale', '1c_kale'),  # ADDED
            ('okra', '1c_okra'),
            ('olive_oil', '1/2tbsp_olive_oil'),
        ],
        'snack2': [
            ('almonds', '1/4c_almonds'),  # REDUCED from 1/2c
        ],
        'snack3': [
            ('greek_yogurt_2pct', '1c_greek_yogurt'),
        ],
        'supplement': 'nutritional_yeast',  # ADDED for B12
    },
    # I'll add all 7 days here...
}

# Calculate all days
print("=" * 80)
print("BULKING PHASE - UPDATED MICRONUTRIENT CALCULATIONS")
print("=" * 80)

for day in [1]:  # Start with day 1
    print(f"\n### BULKING DAY {day} ###\n")
    meals = bulking_meals[day]
    
    day_totals = {}
    for nutrient in DV.keys():
        if nutrient == 'vit_d':
            day_totals[nutrient] = 20.0  # Supplement
            continue
            
        total = 0.0
        for meal_name in ['breakfast', 'lunch', 'snack1', 'dinner', 'snack2', 'snack3']:
            if meal_name in meals:
                meal_total = calculate_meal(meals[meal_name], nutrient)
                total += meal_total
        
        # Add nutritional yeast if present
        if 'supplement' in meals and meals['supplement'] == 'nutritional_yeast':
            if nutrient == 'vit_b12':
                total += calculate_nutrient('nutritional_yeast', 8, nutrient)
            elif nutrient == 'folate':
                total += calculate_nutrient('nutritional_yeast', 8, nutrient)
        
        day_totals[nutrient] = total
    
    # Print results
    for nutrient, dv_value in DV.items():
        value = day_totals[nutrient]
        percentage = (value / dv_value) * 100
        print(f"{nutrient.upper():15s}: {value:7.1f} | DV: {dv_value:7.1f} | {percentage:5.0f}%")

print("\n" + "=" * 80)
print("Calculation complete!")

