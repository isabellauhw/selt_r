# SELT-R: Social Evaluation Learning Task – Revised
This repository contains the implementation of the SELT-R (Social Evaluation Learning Task – Revised; Lau et al., 2024), a modified version of the original SELT task introduced in Button et al. (2023). This adaptation has been redesigned to broaden its applicability, particularly for use with children.

# Overview
The SELT-R is a behavioral task designed to assess social evaluation learning. Participants learn, through trial-based feedback, whether a persona (the “ratee”) is liked or disliked by another persona (the “rater”) using personality-related word pairings (e.g., caring vs uncaring). The task explores both self-referential and other-referential conditions.

# Compared to the original SELT:

The SELT-R introduces 8 experimental blocks, including new “liked-repeat” conditions to mitigate positive bias ceiling effects.

Block order is pseudo-randomised so that “liked-repeat” blocks follow corresponding “disliked” blocks.

Participants can personalise avatars and are immersed in a cover story framed around a school environment.

Ratings are made on a continuous probability scale (0–100), offering more granular data than binary response options.

The task includes two attention checks to ensure data quality and participant engagement.

# Block Structure
Block 0: Practice block
Blocks 1–8: Experimental blocks with self- and other-referential conditions across liked, neutral, disliked, and liked-repeat conditions.
Block -999: Post-task avatar selection (not analysed)

If a participant fails both attention checks, the task automatically ends after Block 5, and only data up to that point will be saved.

# File Structure
index.html: Entry point of the task
js/: Core JavaScript task logic and functions
stimuli/: Avatar images and word stimuli
data/: Output files saved via Pavlovia
README.md: This file

# Output Variables
Variable	Description
width, height	Browser window dimensions
subject_nr	Participant ID
participant_avatar_file, participant_avatar_gender	Participant’s avatar
block_nr	Block number (0 = practice, -999 = avatar evaluation)
rater_name, rater_file	Rater info per block
ratee_type	Referential type: self or other
other_ratee_name, other_ratee_file	Info for the "other" avatar
liking	Block type: positive, neutral, negative
trial_nr	Trial number (0–19)
positive_left	1 if positive word is on the left
positive_correct	1 if positive word is correct
pos_word, neg_word	Presented personality words
correct_word	Correct feedback word
left_word, right_word	Words shown left and right
response	Slider value (0–100)
choice	Word selected based on response
chose_positive	Whether the participant selected the positive word
accuracy	1 if correct feedback received
t_start_experiment, t_start_block, t_start_trial, t_response	Timestamps (ms)
likes_on_left	For global rating, whether positive probe is left
evaluation	Global rating of rater after block
t_ask_eval, t_eval_resp	Timing of global evaluation
attentional_check1, attentional_check2	Slider values from attention checks
avatar_selected_self_file, avatar_selected_other_file	Chosen avatars post-task

⛔ Note: Block -999 (avatar selection) is excluded from analysis. During this block, all learning-related variables (e.g., rater_name, liking, response, accuracy, etc.) are intentionally left blank in the data output.

# License
This project is intended for academic and research use. Please cite the original study if used in publications:

Lau, I.H.W., Norman, J., Stothard, M. et al. Jumping to attributions during social evaluation. Sci Rep 14, 15447 (2024). https://doi.org/10.1038/s41598-024-65704-y
Button, K. S., Kounali, D., Stapinski, L., Rapee, R. M., Lewis, G., & Munafò, M. R. (2015). Fear of negative evaluation biases social evaluation inference: Evidence from a probabilistic learning task. PloS one, 10(4), e0119456.
