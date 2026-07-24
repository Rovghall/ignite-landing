# -*- coding: utf-8 -*-
from __future__ import annotations

CTA = (
    "When logging has to stay honest on busy days, IGNITE AI helps with photo meal snaps, macro edits, "
    "Saved repeats, and workouts in one loop. Snap it. Log it. Crush it."
)

def S(heading, *paras):
    return (heading, list(paras))

def guide(intro, parts, bottom=None):
    sections = [(None, intro)]
    sections.extend(parts)
    if bottom:
        sections.append(S("Bottom line", *bottom, CTA))
    else:
        sections.append(S("Bottom line", CTA))
    return sections


BUILDERS = {}


def _b_burn_1000_calories_a_day(_title):
    return guide(
        ['Burning 1,000 calories a day usually means roughly 1,000 kcal of activity above a sedentary baseline, not 1,000 total daily energy expenditure. Most adults already burn far more than 1,000 kcal/day just staying alive.', 'Chasing that activity burn with endless HIIT is how people get injured, ravenous, and inconsistent. A smarter stack uses steps, lifting, and only as much cardio as recovery allows.'],
        [
        S('Build from NEAT first', 'Walking is the scalable lever. Raising daily steps can add hundreds of kcal with less recovery cost than stacking brutal intervals.', 'Set a weekly step average, not a fragile perfect streak.'),
        S('Lift for the long game', 'Session burn from lifting is often moderate, but muscle retention in a deficit matters more than the watch badge.', 'Keep protein high and progress reps or load over time.'),
        S('Cardio as a precision tool', 'Add steady cardio to close gaps after steps and lifting are set. Stop when sleep and joints complain.', 'If the wearable says 1,000 but you are wrecked, the plan is failing.'),
        S('Food decides if the burn matters', 'Appetite rises with huge expenditure. Unlogged snacks can erase the project. Photograph meals and edit oils.', 'In a cut, do not automatically eat back the full wearable number.'),
        ],
        ['Prefer sustainable NEAT and training over heroic burn screenshots. Recovery and intake honesty decide fat loss.'],
    ), 'How to approach burning about 1,000 activity calories a day without wrecking recovery: NEAT first, lifting, cardio dosing, wearable skepticism, and food-log honesty.'

BUILDERS['burn-1000-calories-a-day'] = _b_burn_1000_calories_a_day


def _b_convert_steps_to_calories(_title):
    return guide(
        ['Every steps-to-calories calculator makes assumptions about gait, intensity, and body mass. It does not know your hills, pack, or stop-and-go pattern.', 'Conversions help planning if you treat them like weather: directional, not courtroom evidence.'],
        [
        S('Variables that matter', 'Bodyweight, pace, grade, and continuity dominate energy cost.', '10,000 continuous brisk steps are not 10,000 fragmented indoor paces.'),
        S('Why converters disagree', 'Different MET tables, stride models, and wearable algorithms create wide spreads.', 'If two apps disagree, use the lower number for fat-loss planning.'),
        S('Workflow', 'Pick one method for four weeks. Log food honestly. Watch weekly average weight. If weight stalls while converter calories look huge, the converter is optimistic or the log is incomplete.', 'Never eat back 100% of converted step calories by default in a cut.'),
        ],
        ['Convert cautiously, validate with weekly weight trends, and keep dinner logging as serious as step math.'],
    ), 'How step-to-calorie conversions work, why bodyweight and pace dominate, why converters disagree, and how to use them without sabotaging a deficit.'

BUILDERS['convert-steps-to-calories'] = _b_convert_steps_to_calories


def _b_if_i_burn_1000_calories_weight_loss(_title):
    return guide(
        ['If you truly expended 1,000 extra kcal per day and did not eat them back, crude teaching math points near about 7,000 kcal per week, often framed around two pounds of fat-energy. Real weeks are messier.', 'Wearable 1,000 kcal claims are often optimistic, and compensation eating can erase the deficit.'],
        [
        S('Crude weekly math', 'About 3,500 kcal per pound of fat is a classroom tool, not a personal guarantee.', 'Fluid and glycogen shifts can make the scale move differently than fat mass.'),
        S('Verify the burn', 'Compare watch totals to conservative estimates. Easy sessions printing 1,000 kcal deserve skepticism.', 'Check whether your food target already included exercise before eating burns back.'),
        S('Protect muscle', 'Keep protein elevated if lifting, often 1.6 to 2.2 g/kg in a deficit, and keep resistance training.'),
        ],
        ['A real extra 1,000 kcal/day can drive weekly fat loss only if the burn is real and the food log is honest.'],
    ), 'Weekly fat-loss expectations from a claimed 1,000 kcal daily burn: crude energy math, water weight, wearable optimism, and verification steps.'

BUILDERS['if-i-burn-1000-calories-weight-loss'] = _b_if_i_burn_1000_calories_weight_loss


def _b_cut_1000_calories_weight_loss_speed(_title):
    return guide(
        ['A 1,000 kcal daily deficit is aggressive for many adults. On paper it predicts fast loss. In practice it often predicts hunger, training collapse, and rebound.', 'Crude math again points near about two pounds of fat-energy per week if the deficit is real, with water making week one look flashier than fat alone.'],
        [
        S('Why steep cuts fail', 'NEAT drops, sleep worsens, weekends explode, and lean mass risk rises without protein and lifting.', 'Adaptive thermogenesis can make harsh diets harder over time.'),
        S('Safer default', 'Find maintenance, subtract about 300 to 500 kcal, keep protein high, lift, and walk. Individualize from weekly averages.'),
        S('Confirm the deficit size', 'Without measured maintenance, your supposed 1,000 cut may be much smaller or recklessly large.'),
        ],
        ['Fast cuts can move the scale and break the process. Moderate deficits usually produce better yearly outcomes.'],
    ), 'What a 1,000 kcal daily deficit implies for speed, lean-mass risk, adherence, and why moderate deficits usually win the year.'

BUILDERS['cut-1000-calories-weight-loss-speed'] = _b_cut_1000_calories_weight_loss_speed


def _b_most_accurate_measure_calories_burned(_title):
    return guide(
        ['The most accurate expenditure methods live in labs. Wrists estimate. Match the tool to the decision.', 'For fat loss, honest intake plus weekly average weight usually beats a perfect burn dashboard.'],
        [
        S('Lab methods', 'Indirect calorimetry estimates resting metabolism from gases. Doubly labeled water estimates free-living expenditure over days in research.'),
        S('Field tools', 'Wearables, MET charts, and machines vary by activity and algorithm. Lifting is easy to misread.'),
        S('Wrong obsession', 'Intake underreporting often dwarfs burn error. Fix dinner logging before buying another gadget.'),
        S('Framework', 'Use wearables for trends. Assume less burn than claimed in a cut. Validate with weight averages.'),
        ],
        ['Execute with weekly averages and honest logging.'],
    ), 'Lab vs consumer calorie-burn measurement: calorimetry, doubly labeled water, MET charts, wearables, and why intake plus weekly weight often beats perfect burn chasing.'

BUILDERS['most-accurate-measure-calories-burned'] = _b_most_accurate_measure_calories_burned


def _b_how_many_calories_burn_per_day(_title):
    return guide(
        ['Daily burn is TDEE, not a motivational poster number.', 'Ask what expenditure pattern supports your goal while you recover and log food.'],
        [
        S('TDEE parts', 'BMR, TEF, NEAT, and exercise. NEAT differences often dwarf small workout length changes.'),
        S('By goal', 'Fat loss needs intake below expenditure. Muscle gain needs fuel and usually a small surplus.'),
        S('Find your number', 'Estimate, log two weeks, keep activity steady, read average weight, then adjust.'),
        ],
        ['Execute with weekly averages and honest logging.'],
    ), 'How to set daily burn thinking using TDEE parts (BMR, TEF, NEAT, exercise) and validate with real-world logging.'

BUILDERS['how-many-calories-burn-per-day'] = _b_how_many_calories_burn_per_day


def _b_calories_from_fat_calculate(_title):
    return guide(
        ['Fat has about 9 kcal per gram. Multiply fat grams by 9.', 'A 20 g fat meal contributes roughly 180 kcal from fat.'],
        [
        S('Labels', 'Check serving size first, then fat grams times nine.'),
        S('Oils', 'A tablespoon of oil is often around 14 g fat, roughly 120 kcal, easy to miss visually.'),
        S('Photo edits', 'Bias fats up on glossy or fried meals when snapping plates.'),
        ],
        ['Execute with weekly averages and honest logging.'],
    ), 'Convert fat grams to calories with the 9 kcal/g rule, label pitfalls, oils, and photo-log edits.'

BUILDERS['calories-from-fat-calculate'] = _b_calories_from_fat_calculate


def _b_bodybuilder_calories_how_many(_title):
    return guide(
        ['There is no universal bodybuilder calorie intake.', 'Method transfers: find maintenance, set small surplus or controlled deficit, keep protein high, train hard.'],
        [
        S('Off-season', 'Many intermediates use about +200 to +300 kcal over maintenance for leaner gains.'),
        S('Prep', 'Deficits scale to deadlines; late prep can be aggressive and should be time-limited.'),
        S('Your number', 'Log honestly two weeks, stabilize activity, adjust 100 to 200 kcal at a time.'),
        ],
        ['Execute with weekly averages and honest logging.'],
    ), "Why bodybuilder calories vary by phase and size, with surplus and deficit methods you can copy without copying someone else's numbers."

BUILDERS['bodybuilder-calories-how-many'] = _b_bodybuilder_calories_how_many


def _b_calories_per_meal_guide(_title):
    return guide(
        ['Meal calories are daily calories packaged by schedule.', 'There is no sacred lunch number.'],
        [
        S('Start from the day', 'Set daily calories and protein, then split across meals you will actually eat.'),
        S('Protein distribution', 'Spread protein when possible instead of one giant dump.'),
        S('Social meals', 'Budget larger dinners on purpose and log them.'),
        ],
        ['Execute with weekly averages and honest logging.'],
    ), 'How to split daily calories across meals without dogma, including protein distribution and IF windows.'

BUILDERS['calories-per-meal-guide'] = _b_calories_per_meal_guide


def _b_calories_to_gain_muscle(_title):
    return guide(
        ['Muscle gain needs training, protein, time, and usually a surplus after beginner phases.', 'Many intermediates do well at about +200 to +300 kcal over true maintenance.'],
        [
        S('Maintenance first', 'Two weeks of logging and stable average weight beat guessing.'),
        S('Rate of gain', 'Often roughly 0.25% to 0.5% bodyweight per week for many intermediates.'),
        S('Protein', 'About 1.6 to 2.2 g/kg with carbs high enough to perform.'),
        ],
        ['Execute with weekly averages and honest logging.'],
    ), 'Set calories for muscle gain with small surplus, rate-of-gain targets, and anti-dirty-bulk logging.'

BUILDERS['calories-to-gain-muscle'] = _b_calories_to_gain_muscle


def _b_calories_dinner_weight_loss(_title):
    return guide(
        ['Dinner has no magic fat-loss calorie.', 'The day and week decide.'],
        [
        S('Budget', 'If earlier meals used most calories, dinner must shrink, or earlier meals must leave room.'),
        S('Protein first', 'Anchor dinner protein so the meal is not only carbs and alcohol.'),
        S('Restaurants', 'Snap, bias fats up, keep protein honest, move on.'),
        ],
        ['Execute with weekly averages and honest logging.'],
    ), 'Set dinner calories inside a fat-loss day: budgeting, protein anchors, and restaurant tactics.'

BUILDERS['calories-dinner-weight-loss'] = _b_calories_dinner_weight_loss


def _b_calories_lunch_fitness_goals(_title):
    return guide(
        ['Lunch should prevent chaotic dinners.', 'Exact calories depend on daily targets.'],
        [
        S('Split', 'Often near a third on three-meal days, adjusted for training time.'),
        S('Defaults', 'Build two repeat lunches, calibrate, save, reuse.'),
        S('Training', 'Put more carbs at lunch if you train after.'),
        ],
        ['Execute with weekly averages and honest logging.'],
    ), 'Build lunch calories for performance and adherence with defaults and Saved meals.'

BUILDERS['calories-lunch-fitness-goals'] = _b_calories_lunch_fitness_goals


def _b_how_long_burn_500_calories(_title):
    return guide(
        ['Time to burn 500 kcal shrinks as intensity and bodyweight rise.', 'No single answer without those variables.'],
        [
        S('Walking', 'Brisk walking may take a large fraction of an hour or more depending on mass and speed.'),
        S('Hard modalities', 'Running or vigorous cardio can be faster with higher recovery cost.'),
        S('Lifting caveat', 'Screens overstate intermittent lifting burns; value muscle stimulus too.'),
        ],
        ['Execute with weekly averages and honest logging.'],
    ), 'How long ~500 kcal takes across modalities and why bodyweight changes the clock.'

BUILDERS['how-long-burn-500-calories'] = _b_how_long_burn_500_calories


def _b_500_calorie_meals_weight_loss(_title):
    return guide(
        ['500-calorie meals can work inside a planned day.', 'They fail when they are so small you binge later.'],
        [
        S('Build them', 'Prioritize protein and volume; measure oils.'),
        S('Fit', 'Useful on four-meal days or to budget social dinners.'),
        S('Fail', 'Athletes may underfuel if every meal is tiny.'),
        ],
        ['Execute with weekly averages and honest logging.'],
    ), 'When 500-calorie meals work in a fat-loss day and how to keep them high-protein and satisfying.'

BUILDERS['500-calorie-meals-weight-loss'] = _b_500_calorie_meals_weight_loss


def _b_eating_1000_calories_a_day(_title):
    return guide(
        ['1,000 kcal days usually create a large deficit for many adults.', 'Fast drops include water and raise rebound risk.'],
        [
        S('Risks', 'Lean mass loss, nutrient gaps, social fragility, medical issues for some.'),
        S('Better path', 'Moderate deficit from true maintenance with high protein and lifting.'),
        S('If you crashed', 'Raise carefully toward sustainability rather than living in fear at 1,000.'),
        ],
        ['Execute with weekly averages and honest logging.'],
    ), 'Why 1,000 kcal days can drop the scale and damage long-term results.'

BUILDERS['eating-1000-calories-a-day'] = _b_eating_1000_calories_a_day


def _b_how_calories_are_measured(_title):
    return guide(
        ['Food label calories use established energy factors, not your personal bomb calorimeter.', 'Your job is accuracy enough for weekly decisions.'],
        [
        S('Methods', 'Labels, scale plus database, recipe math, barcodes, photo estimates, menus, hand portions, wearable burns, and lab contexts.'),
        S('Hybrid', 'Labels and scale for staples; photos for chaos; weekly averages for truth.'),
        ],
        ['Execute with weekly averages and honest logging.'],
    ), 'Nine practical ways calories are measured from lab factors to labels, scales, photos, and menus.'

BUILDERS['how-calories-are-measured'] = _b_how_calories_are_measured


def _b_food_scale_for_calories_macros(_title):
    return guide(
        ['A scale is high leverage if you weigh dense foods, not every lettuce leaf.', 'Oils, rice, meat, cheese, and nut butters matter most.'],
        [
        S('Tare', 'Zero the bowl, then add food.'),
        S('Raw vs cooked', 'Match database states or create fake swings.'),
        S('Calibrate', 'Weigh staples, save them, then use speed logging.'),
        ],
        ['Execute with weekly averages and honest logging.'],
    ), 'Food-scale workflow: what to weigh, tare, raw vs cooked, and calibrate then relax.'

BUILDERS['food-scale-for-calories-macros'] = _b_food_scale_for_calories_macros


def _b_measure_calories_food_at_home(_title):
    return guide(
        ['Home methods will not match a metabolic ward.', 'They can still guide fat loss if bias stays small.'],
        [
        S('Toolkit', 'Labels, scale, recipe math, photos, leftover notes.'),
        S('Calibration', 'Weigh five repeats weekly at first, compare to photo edits, save winners.'),
        S('Errors', 'Oil guesses, serving sizes, raw/cooked mismatches, cooking bites.'),
        ],
        ['Execute with weekly averages and honest logging.'],
    ), 'Home calorie measurement toolkit and a weekly calibration routine.'

BUILDERS['measure-calories-food-at-home'] = _b_measure_calories_food_at_home


def _b_count_calories_when_cooking(_title):
    return guide(
        ['Cooking breaks trackers when oil is forgotten or servings are mythical.', 'Count the batch, then divide what you scoop.'],
        [
        S('Batch method', 'Log ingredients, weigh dense items, sum, portion, save.'),
        S('Leftovers', 'Reuse Saved fractions instead of rebuilding memory math.'),
        S('Tastes', 'They count; buffer or stop grazing.'),
        ],
        ['Execute with weekly averages and honest logging.'],
    ), 'Count homemade meals by logging the whole pot, dividing real servings, and saving the batch.'

BUILDERS['count-calories-when-cooking'] = _b_count_calories_when_cooking


def _b_track_calorie_deficit_healthy(_title):
    return guide(
        ['A healthy deficit supports training and life while fat trends down for weeks.', 'Tracking should not become a shame job.'],
        [
        S('Set', 'About 300 to 500 kcal below true maintenance for many lifters as a starting band.'),
        S('Protect', 'Protein 1.6 to 2.2 g/kg and lifting.'),
        S('Scoreboard', 'Weekly averages, waist, performance.'),
        S('Breaks', 'Diet-break at maintenance if everything collapses.'),
        ],
        ['Execute with weekly averages and honest logging.'],
    ), 'Track a healthy deficit with moderate cuts, protein, lifting, averages, and sustainable logging.'

BUILDERS['track-calorie-deficit-healthy'] = _b_track_calorie_deficit_healthy


def _b_active_vs_total_calories(_title):
    return guide(
        ['Active usually means movement burn; total usually includes resting metabolism.', 'Brands define these differently.'],
        [
        S('Fat loss use', 'Do not worship either. Avoid eating active calories back if totals already shaped intake.'),
        S('Confusion', 'Cross-brand screenshots are unreliable.'),
        S('Rule', 'One metric for trends, conservative cut interpretation, honest food log.'),
        ],
        ['Execute with weekly averages and honest logging.'],
    ), 'Active vs total calories on wearables and how to avoid double counting.'

BUILDERS['active-vs-total-calories'] = _b_active_vs_total_calories


def _b_active_vs_resting_calories(_title):
    return guide(
        ['Resting calories keep you alive at rest; active cover movement.', 'Together with TEF they shape TDEE.'],
        [
        S('Resting', 'Scales with size and lean mass patterns.'),
        S('Active', 'NEAT often matters more than people think.'),
        S('Raise burn', 'Lift, walk, add cardio as needed, sleep.'),
        ],
        ['Execute with weekly averages and honest logging.'],
    ), 'Resting vs active calories: BMR/RMR versus movement, and smart ways to raise expenditure.'

BUILDERS['active-vs-resting-calories'] = _b_active_vs_resting_calories


def _b_track_calories_burned_tools(_title):
    return guide(
        ['You need one or two tools you will use, plus a reality check.', 'More gadgets do not fix underreported dinners.'],
        [
        S('Tool map', 'Wearable, HR strap, phone steps, MET charts, consoles, training log, step averages, optional RMR, conservative rules, weight averages, waist/photos, honest food log.'),
        S('Use', 'Interpret burn low in cuts; let averages referee.'),
        ],
        ['Execute with weekly averages and honest logging.'],
    ), 'Twelve tools for tracking burn from wearables to the referee of weekly weight plus intake.'

BUILDERS['track-calories-burned-tools'] = _b_track_calories_burned_tools


def _b_how_many_calories_sit_ups(_title):
    return guide(
        ['People ask about sit ups calories because they want the session to justify dinner. Session burn is real, but it is usually smaller and noisier than the afterburn myths suggest.', 'Bodyweight, intensity, rest periods, and total work time dominate the estimate for sit ups. Two people doing the same named workout can land far apart.', 'Fat loss still follows weekly energy balance. Use training for stimulus and health first, and treat calorie printouts conservatively in a cut.'],
        [
        S('What actually drives the burn', 'For sit ups, intensity and continuous work matter more than the exercise nickname. Hard efforts with long rests are not the same energy cost as continuous conditioning.', 'Heavier bodies generally expend more energy doing the same movement pattern at the same speed or load.'),
        S('Order-of-magnitude expectations', 'Consumer devices often assign tidy numbers to sit ups. Treat them as a range with wide error bars, especially for intermittent efforts.', 'If a short easy set somehow prints a huge calorie total, assume optimism and plan food as if the burn were lower.'),
        S('Muscle stimulus vs calorie theater', 'The training value of sit ups may matter more than the session kcal badge. Preserving or building muscle supports long-term energy needs and how you look at a given weight.', 'Keep protein around 1.6 to 2.2 g/kg if you are dieting and lifting.'),
        S('Wearables and machine consoles', 'Wrist estimates struggle with load, rest, and non-step movements. Gym machine screens are convenient and frequently inflated.', 'In a fat-loss phase, do not auto-eat the full printed number.'),
        S('A practical logging approach', 'Log sit ups sessions for consistency and progressive overload. Separately log food with photos when meals are chaotic.', 'IGNITE AI keeps workouts and meal snaps on one timeline so training does not become an excuse to stop logging dinner.'),
        S('Who should care less about the calorie number', 'If your goal is strength, skill, or physique quality, progressive training and protein beat chasing a session burn target.', 'If your goal is pure expenditure, walking and other continuous modalities are often easier to dose than short intermittent sets.'),
        ],
        ['Use sit ups for training value, interpret burn conservatively, hit protein, and keep the food log honest.'],
    ), 'A detailed look at calorie burn from sit ups: what drives the estimate, bodyweight and intensity effects, wearable error, muscle vs calorie theater, and how to log training without eating the whole burn back.'

BUILDERS['how-many-calories-sit-ups'] = _b_how_many_calories_sit_ups


def _b_how_many_calories_skiing(_title):
    return guide(
        ['People ask about skiing calories because they want the session to justify dinner. Session burn is real, but it is usually smaller and noisier than the afterburn myths suggest.', 'Bodyweight, intensity, rest periods, and total work time dominate the estimate for skiing. Two people doing the same named workout can land far apart.', 'Fat loss still follows weekly energy balance. Use training for stimulus and health first, and treat calorie printouts conservatively in a cut.'],
        [
        S('What actually drives the burn', 'For skiing, intensity and continuous work matter more than the exercise nickname. Hard efforts with long rests are not the same energy cost as continuous conditioning.', 'Heavier bodies generally expend more energy doing the same movement pattern at the same speed or load.'),
        S('Order-of-magnitude expectations', 'Consumer devices often assign tidy numbers to skiing. Treat them as a range with wide error bars, especially for intermittent efforts.', 'If a short easy set somehow prints a huge calorie total, assume optimism and plan food as if the burn were lower.'),
        S('Muscle stimulus vs calorie theater', 'The training value of skiing may matter more than the session kcal badge. Preserving or building muscle supports long-term energy needs and how you look at a given weight.', 'Keep protein around 1.6 to 2.2 g/kg if you are dieting and lifting.'),
        S('Wearables and machine consoles', 'Wrist estimates struggle with load, rest, and non-step movements. Gym machine screens are convenient and frequently inflated.', 'In a fat-loss phase, do not auto-eat the full printed number.'),
        S('A practical logging approach', 'Log skiing sessions for consistency and progressive overload. Separately log food with photos when meals are chaotic.', 'IGNITE AI keeps workouts and meal snaps on one timeline so training does not become an excuse to stop logging dinner.'),
        S('Who should care less about the calorie number', 'If your goal is strength, skill, or physique quality, progressive training and protein beat chasing a session burn target.', 'If your goal is pure expenditure, walking and other continuous modalities are often easier to dose than short intermittent sets.'),
        ],
        ['Use skiing for training value, interpret burn conservatively, hit protein, and keep the food log honest.'],
    ), 'A detailed look at calorie burn from skiing: what drives the estimate, bodyweight and intensity effects, wearable error, muscle vs calorie theater, and how to log training without eating the whole burn back.'

BUILDERS['how-many-calories-skiing'] = _b_how_many_calories_skiing


def _b_how_many_calories_squats(_title):
    return guide(
        ['People ask about squats calories because they want the session to justify dinner. Session burn is real, but it is usually smaller and noisier than the afterburn myths suggest.', 'Bodyweight, intensity, rest periods, and total work time dominate the estimate for squats. Two people doing the same named workout can land far apart.', 'Fat loss still follows weekly energy balance. Use training for stimulus and health first, and treat calorie printouts conservatively in a cut.'],
        [
        S('What actually drives the burn', 'For squats, intensity and continuous work matter more than the exercise nickname. Hard efforts with long rests are not the same energy cost as continuous conditioning.', 'Heavier bodies generally expend more energy doing the same movement pattern at the same speed or load.'),
        S('Order-of-magnitude expectations', 'Consumer devices often assign tidy numbers to squats. Treat them as a range with wide error bars, especially for intermittent efforts.', 'If a short easy set somehow prints a huge calorie total, assume optimism and plan food as if the burn were lower.'),
        S('Muscle stimulus vs calorie theater', 'The training value of squats may matter more than the session kcal badge. Preserving or building muscle supports long-term energy needs and how you look at a given weight.', 'Keep protein around 1.6 to 2.2 g/kg if you are dieting and lifting.'),
        S('Wearables and machine consoles', 'Wrist estimates struggle with load, rest, and non-step movements. Gym machine screens are convenient and frequently inflated.', 'In a fat-loss phase, do not auto-eat the full printed number.'),
        S('A practical logging approach', 'Log squats sessions for consistency and progressive overload. Separately log food with photos when meals are chaotic.', 'IGNITE AI keeps workouts and meal snaps on one timeline so training does not become an excuse to stop logging dinner.'),
        S('Who should care less about the calorie number', 'If your goal is strength, skill, or physique quality, progressive training and protein beat chasing a session burn target.', 'If your goal is pure expenditure, walking and other continuous modalities are often easier to dose than short intermittent sets.'),
        ],
        ['Use squats for training value, interpret burn conservatively, hit protein, and keep the food log honest.'],
    ), 'A detailed look at calorie burn from squats: what drives the estimate, bodyweight and intensity effects, wearable error, muscle vs calorie theater, and how to log training without eating the whole burn back.'

BUILDERS['how-many-calories-squats'] = _b_how_many_calories_squats


def _b_how_many_calories_push_ups(_title):
    return guide(
        ['People ask about push ups calories because they want the session to justify dinner. Session burn is real, but it is usually smaller and noisier than the afterburn myths suggest.', 'Bodyweight, intensity, rest periods, and total work time dominate the estimate for push ups. Two people doing the same named workout can land far apart.', 'Fat loss still follows weekly energy balance. Use training for stimulus and health first, and treat calorie printouts conservatively in a cut.'],
        [
        S('What actually drives the burn', 'For push ups, intensity and continuous work matter more than the exercise nickname. Hard efforts with long rests are not the same energy cost as continuous conditioning.', 'Heavier bodies generally expend more energy doing the same movement pattern at the same speed or load.'),
        S('Order-of-magnitude expectations', 'Consumer devices often assign tidy numbers to push ups. Treat them as a range with wide error bars, especially for intermittent efforts.', 'If a short easy set somehow prints a huge calorie total, assume optimism and plan food as if the burn were lower.'),
        S('Muscle stimulus vs calorie theater', 'The training value of push ups may matter more than the session kcal badge. Preserving or building muscle supports long-term energy needs and how you look at a given weight.', 'Keep protein around 1.6 to 2.2 g/kg if you are dieting and lifting.'),
        S('Wearables and machine consoles', 'Wrist estimates struggle with load, rest, and non-step movements. Gym machine screens are convenient and frequently inflated.', 'In a fat-loss phase, do not auto-eat the full printed number.'),
        S('A practical logging approach', 'Log push ups sessions for consistency and progressive overload. Separately log food with photos when meals are chaotic.', 'IGNITE AI keeps workouts and meal snaps on one timeline so training does not become an excuse to stop logging dinner.'),
        S('Who should care less about the calorie number', 'If your goal is strength, skill, or physique quality, progressive training and protein beat chasing a session burn target.', 'If your goal is pure expenditure, walking and other continuous modalities are often easier to dose than short intermittent sets.'),
        ],
        ['Use push ups for training value, interpret burn conservatively, hit protein, and keep the food log honest.'],
    ), 'A detailed look at calorie burn from push ups: what drives the estimate, bodyweight and intensity effects, wearable error, muscle vs calorie theater, and how to log training without eating the whole burn back.'

BUILDERS['how-many-calories-push-ups'] = _b_how_many_calories_push_ups


def _b_how_many_calories_swimming(_title):
    return guide(
        ['People ask about swimming calories because they want the session to justify dinner. Session burn is real, but it is usually smaller and noisier than the afterburn myths suggest.', 'Bodyweight, intensity, rest periods, and total work time dominate the estimate for swimming. Two people doing the same named workout can land far apart.', 'Fat loss still follows weekly energy balance. Use training for stimulus and health first, and treat calorie printouts conservatively in a cut.'],
        [
        S('What actually drives the burn', 'For swimming, intensity and continuous work matter more than the exercise nickname. Hard efforts with long rests are not the same energy cost as continuous conditioning.', 'Heavier bodies generally expend more energy doing the same movement pattern at the same speed or load.'),
        S('Order-of-magnitude expectations', 'Consumer devices often assign tidy numbers to swimming. Treat them as a range with wide error bars, especially for intermittent efforts.', 'If a short easy set somehow prints a huge calorie total, assume optimism and plan food as if the burn were lower.'),
        S('Muscle stimulus vs calorie theater', 'The training value of swimming may matter more than the session kcal badge. Preserving or building muscle supports long-term energy needs and how you look at a given weight.', 'Keep protein around 1.6 to 2.2 g/kg if you are dieting and lifting.'),
        S('Wearables and machine consoles', 'Wrist estimates struggle with load, rest, and non-step movements. Gym machine screens are convenient and frequently inflated.', 'In a fat-loss phase, do not auto-eat the full printed number.'),
        S('A practical logging approach', 'Log swimming sessions for consistency and progressive overload. Separately log food with photos when meals are chaotic.', 'IGNITE AI keeps workouts and meal snaps on one timeline so training does not become an excuse to stop logging dinner.'),
        S('Who should care less about the calorie number', 'If your goal is strength, skill, or physique quality, progressive training and protein beat chasing a session burn target.', 'If your goal is pure expenditure, walking and other continuous modalities are often easier to dose than short intermittent sets.'),
        ],
        ['Use swimming for training value, interpret burn conservatively, hit protein, and keep the food log honest.'],
    ), 'A detailed look at calorie burn from swimming: what drives the estimate, bodyweight and intensity effects, wearable error, muscle vs calorie theater, and how to log training without eating the whole burn back.'

BUILDERS['how-many-calories-swimming'] = _b_how_many_calories_swimming


def _b_how_many_calories_pilates(_title):
    return guide(
        ['People ask about pilates calories because they want the session to justify dinner. Session burn is real, but it is usually smaller and noisier than the afterburn myths suggest.', 'Bodyweight, intensity, rest periods, and total work time dominate the estimate for pilates. Two people doing the same named workout can land far apart.', 'Fat loss still follows weekly energy balance. Use training for stimulus and health first, and treat calorie printouts conservatively in a cut.'],
        [
        S('What actually drives the burn', 'For pilates, intensity and continuous work matter more than the exercise nickname. Hard efforts with long rests are not the same energy cost as continuous conditioning.', 'Heavier bodies generally expend more energy doing the same movement pattern at the same speed or load.'),
        S('Order-of-magnitude expectations', 'Consumer devices often assign tidy numbers to pilates. Treat them as a range with wide error bars, especially for intermittent efforts.', 'If a short easy set somehow prints a huge calorie total, assume optimism and plan food as if the burn were lower.'),
        S('Muscle stimulus vs calorie theater', 'The training value of pilates may matter more than the session kcal badge. Preserving or building muscle supports long-term energy needs and how you look at a given weight.', 'Keep protein around 1.6 to 2.2 g/kg if you are dieting and lifting.'),
        S('Wearables and machine consoles', 'Wrist estimates struggle with load, rest, and non-step movements. Gym machine screens are convenient and frequently inflated.', 'In a fat-loss phase, do not auto-eat the full printed number.'),
        S('A practical logging approach', 'Log pilates sessions for consistency and progressive overload. Separately log food with photos when meals are chaotic.', 'IGNITE AI keeps workouts and meal snaps on one timeline so training does not become an excuse to stop logging dinner.'),
        S('Who should care less about the calorie number', 'If your goal is strength, skill, or physique quality, progressive training and protein beat chasing a session burn target.', 'If your goal is pure expenditure, walking and other continuous modalities are often easier to dose than short intermittent sets.'),
        ],
        ['Use pilates for training value, interpret burn conservatively, hit protein, and keep the food log honest.'],
    ), 'A detailed look at calorie burn from pilates: what drives the estimate, bodyweight and intensity effects, wearable error, muscle vs calorie theater, and how to log training without eating the whole burn back.'

BUILDERS['how-many-calories-pilates'] = _b_how_many_calories_pilates


def _b_how_many_calories_jumping_jacks(_title):
    return guide(
        ['People ask about jumping jacks calories because they want the session to justify dinner. Session burn is real, but it is usually smaller and noisier than the afterburn myths suggest.', 'Bodyweight, intensity, rest periods, and total work time dominate the estimate for jumping jacks. Two people doing the same named workout can land far apart.', 'Fat loss still follows weekly energy balance. Use training for stimulus and health first, and treat calorie printouts conservatively in a cut.'],
        [
        S('What actually drives the burn', 'For jumping jacks, intensity and continuous work matter more than the exercise nickname. Hard efforts with long rests are not the same energy cost as continuous conditioning.', 'Heavier bodies generally expend more energy doing the same movement pattern at the same speed or load.'),
        S('Order-of-magnitude expectations', 'Consumer devices often assign tidy numbers to jumping jacks. Treat them as a range with wide error bars, especially for intermittent efforts.', 'If a short easy set somehow prints a huge calorie total, assume optimism and plan food as if the burn were lower.'),
        S('Muscle stimulus vs calorie theater', 'The training value of jumping jacks may matter more than the session kcal badge. Preserving or building muscle supports long-term energy needs and how you look at a given weight.', 'Keep protein around 1.6 to 2.2 g/kg if you are dieting and lifting.'),
        S('Wearables and machine consoles', 'Wrist estimates struggle with load, rest, and non-step movements. Gym machine screens are convenient and frequently inflated.', 'In a fat-loss phase, do not auto-eat the full printed number.'),
        S('A practical logging approach', 'Log jumping jacks sessions for consistency and progressive overload. Separately log food with photos when meals are chaotic.', 'IGNITE AI keeps workouts and meal snaps on one timeline so training does not become an excuse to stop logging dinner.'),
        S('Who should care less about the calorie number', 'If your goal is strength, skill, or physique quality, progressive training and protein beat chasing a session burn target.', 'If your goal is pure expenditure, walking and other continuous modalities are often easier to dose than short intermittent sets.'),
        ],
        ['Use jumping jacks for training value, interpret burn conservatively, hit protein, and keep the food log honest.'],
    ), 'A detailed look at calorie burn from jumping jacks: what drives the estimate, bodyweight and intensity effects, wearable error, muscle vs calorie theater, and how to log training without eating the whole burn back.'

BUILDERS['how-many-calories-jumping-jacks'] = _b_how_many_calories_jumping_jacks


def _b_how_many_calories_weight_lifting(_title):
    return guide(
        ['People ask about weight lifting calories because they want the session to justify dinner. Session burn is real, but it is usually smaller and noisier than the afterburn myths suggest.', 'Bodyweight, intensity, rest periods, and total work time dominate the estimate for weight lifting. Two people doing the same named workout can land far apart.', 'Fat loss still follows weekly energy balance. Use training for stimulus and health first, and treat calorie printouts conservatively in a cut.'],
        [
        S('What actually drives the burn', 'For weight lifting, intensity and continuous work matter more than the exercise nickname. Hard efforts with long rests are not the same energy cost as continuous conditioning.', 'Heavier bodies generally expend more energy doing the same movement pattern at the same speed or load.'),
        S('Order-of-magnitude expectations', 'Consumer devices often assign tidy numbers to weight lifting. Treat them as a range with wide error bars, especially for intermittent efforts.', 'If a short easy set somehow prints a huge calorie total, assume optimism and plan food as if the burn were lower.'),
        S('Muscle stimulus vs calorie theater', 'The training value of weight lifting may matter more than the session kcal badge. Preserving or building muscle supports long-term energy needs and how you look at a given weight.', 'Keep protein around 1.6 to 2.2 g/kg if you are dieting and lifting.'),
        S('Wearables and machine consoles', 'Wrist estimates struggle with load, rest, and non-step movements. Gym machine screens are convenient and frequently inflated.', 'In a fat-loss phase, do not auto-eat the full printed number.'),
        S('A practical logging approach', 'Log weight lifting sessions for consistency and progressive overload. Separately log food with photos when meals are chaotic.', 'IGNITE AI keeps workouts and meal snaps on one timeline so training does not become an excuse to stop logging dinner.'),
        S('Who should care less about the calorie number', 'If your goal is strength, skill, or physique quality, progressive training and protein beat chasing a session burn target.', 'If your goal is pure expenditure, walking and other continuous modalities are often easier to dose than short intermittent sets.'),
        ],
        ['Use weight lifting for training value, interpret burn conservatively, hit protein, and keep the food log honest.'],
    ), 'A detailed look at calorie burn from weight lifting: what drives the estimate, bodyweight and intensity effects, wearable error, muscle vs calorie theater, and how to log training without eating the whole burn back.'

BUILDERS['how-many-calories-weight-lifting'] = _b_how_many_calories_weight_lifting


def _b_how_many_calories_running_mile(_title):
    return guide(
        ['People ask about running mile calories because they want the session to justify dinner. Session burn is real, but it is usually smaller and noisier than the afterburn myths suggest.', 'Bodyweight, intensity, rest periods, and total work time dominate the estimate for running mile. Two people doing the same named workout can land far apart.', 'Fat loss still follows weekly energy balance. Use training for stimulus and health first, and treat calorie printouts conservatively in a cut.'],
        [
        S('What actually drives the burn', 'For running mile, intensity and continuous work matter more than the exercise nickname. Hard efforts with long rests are not the same energy cost as continuous conditioning.', 'Heavier bodies generally expend more energy doing the same movement pattern at the same speed or load.'),
        S('Order-of-magnitude expectations', 'Consumer devices often assign tidy numbers to running mile. Treat them as a range with wide error bars, especially for intermittent efforts.', 'If a short easy set somehow prints a huge calorie total, assume optimism and plan food as if the burn were lower.'),
        S('Muscle stimulus vs calorie theater', 'The training value of running mile may matter more than the session kcal badge. Preserving or building muscle supports long-term energy needs and how you look at a given weight.', 'Keep protein around 1.6 to 2.2 g/kg if you are dieting and lifting.'),
        S('Wearables and machine consoles', 'Wrist estimates struggle with load, rest, and non-step movements. Gym machine screens are convenient and frequently inflated.', 'In a fat-loss phase, do not auto-eat the full printed number.'),
        S('A practical logging approach', 'Log running mile sessions for consistency and progressive overload. Separately log food with photos when meals are chaotic.', 'IGNITE AI keeps workouts and meal snaps on one timeline so training does not become an excuse to stop logging dinner.'),
        S('Who should care less about the calorie number', 'If your goal is strength, skill, or physique quality, progressive training and protein beat chasing a session burn target.', 'If your goal is pure expenditure, walking and other continuous modalities are often easier to dose than short intermittent sets.'),
        ],
        ['Use running mile for training value, interpret burn conservatively, hit protein, and keep the food log honest.'],
    ), 'A detailed look at calorie burn from running mile: what drives the estimate, bodyweight and intensity effects, wearable error, muscle vs calorie theater, and how to log training without eating the whole burn back.'

BUILDERS['how-many-calories-running-mile'] = _b_how_many_calories_running_mile


def _b_protein_for_body_recomp(_title):
    return guide(
        ['Recomp is most realistic for beginners, returners, and higher body-fat lifters.', 'Protein often works best toward 1.6 to 2.2 g/kg near maintenance or a mild deficit.'],
        [
        S('Who can recomp', 'New lifters and returning lifters see it most.'),
        S('Advanced', 'Usually need clearer surplus or deficit phases.'),
        S('Execute', 'Progressive lifting, sleep, honest logging, weekly averages.'),
        ],
        ['Execute with weekly averages and honest logging.'],
    ), 'Protein targets for body recomposition with training and calorie context.'

BUILDERS['protein-for-body-recomp'] = _b_protein_for_body_recomp


def _b_gain_muscle_lose_fat_same_time(_title):
    return guide(
        ['Simultaneous recomp happens most when you are new or returning.', 'Advanced lifters usually alternate phases.'],
        [
        S('Requirements', 'High protein, hard progressive training, patience, calories near maintenance or mild deficit if fat is high.'),
        S('Tracking', 'Strength up, waist down, weekly averages beat daily scale drama.'),
        ],
        ['Execute with weekly averages and honest logging.'],
    ), 'How simultaneous fat loss and muscle gain really works and who should expect it.'

BUILDERS['gain-muscle-lose-fat-same-time'] = _b_gain_muscle_lose_fat_same_time


def _b_track_alcohol_macros(_title):
    return guide(
        ['Alcohol is about 7 kcal per gram and is not a classic macro like protein.', 'Mixers count. Sleep and next-day adherence often take the bigger hit.'],
        [
        S('Log it', 'Enter drink calories like food. Budget into weekly averages.'),
        S('Training days', 'Hard sessions and heavy drinking pair poorly.'),
        ],
        ['Execute with weekly averages and honest logging.'],
    ), 'Track alcohol energy using ~7 kcal/g, mixers, sleep effects, and weekly budgeting.'

BUILDERS['track-alcohol-macros'] = _b_track_alcohol_macros
