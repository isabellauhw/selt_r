"use strict";

// static/main.js
// The main logic for our task.

// We follow a rule of only creating two global variables.

// `globals` is an object containing any information we want to make
// globally available in the task. `state` is an object containing
// information that is globally available, AND which will be sent to
// the server at the end of each trial;

// We populate both with default values now, so we can know at a
// glance what values they can store. This is better than adding new
// values on an ad-hoc basis, which often leads to bugs.

let get_avatar_info = function(filename) {
    let shuffledAvatars = _.shuffle(AVATARS);
    let filteredAvatar = shuffledAvatars.find(x => x.file === filename);
    return filteredAvatar;
};

let avatarSequence = _.shuffle(_.range(1, 15)); // Generate a random sequence of avatar indices

let globals = {
    pavlovia: new Pavlovia(),
    n_blocks: 10,
    n_trials: 20,
    animation_delay: 1000,
    design: null, // Built below
    //male1, male2, ..., female1, etc.
    //player_avatars:  _.flatten(['male', 'female'].map( g => _.range(1, 8).map( i => g + i))),
    //other_avatars: _.flatten(['male', 'female'].map( g => _.range(8, 15).map( i => g + i))),
    player_avatars:  _.flatten(['male', 'female'].map(g => {
        return avatarSequence.slice(0, 5).map(i => g + i);
    })),
    other_avatars:_.flatten(['male', 'female'].map(g => {
        return avatarSequence.slice(5, 15).map(i => g + i);
    })),
    rater_avatars: null,
    player_avatar_info: null, // The one chosen
    rater_avatar_info: null,
    ratee_avatar_info: null,
    feedback_rules: {
        like:    {pos: 16, neg: 4},
        neutral: {pos: 10, neg: 10},
        dislike: {pos: 4, neg: 16},
        practice_neutral: {pos: 3, neg: 3}
    },
    word_pairs: null, // Populated from WORDS every block
    likes_on_left: null // Will be a list
};

let state = {
    // `width` and `height` get updated every time the window is resized.
    width: null,
    height: null,
    subject_nr: null,
    //participant_avatar_profile: null,
    participant_avatar_file: null,
    participant_avatar_gender: null,
    // Block settings
    block_nr: 0,
    rater_name: null, // First name
    rater_file: null, // File name
    ratee_type: null, // 'you', or a third person
    other_ratee_name: null,
    other_ratee_file: null,
    liking: null, // 'like', 'neutral', or 'dislike'
    // Trial parameters
    trial_nr: 1,
    //response_magnitude: null,
    //magnitude_size: null,
    positive_left: null,
    positive_correct: null,
    pos_word: null,
    neg_word: null,
    correct_word: null,
    left_word: null,
    right_word: null,
    response: null,
    choice: null,
    chose_positive: null,
    accuracy: null,
    // Timestamps
    t_start_experiment: null,
    t_start_block: null,
    t_start_trial: null,
    t_response: null,
    // End of block stuff
    likes_on_left: null, // 0 or 1
    evaluation: null,
    t_ask_eval: null,
    t_eval_resp: null,
    // Attentional check
    attentional_check1: null,
    attentional_check2: null,
    //Final selection
    avatar_selected_self_file: null,
    avatar_selected_other_file: null
};
let old_keys = Object.keys(state); // for debugging

// When everything's loaded, call the `Ready` function.
$(document).ready(Ready);

    // Design is ratee [r] (you or otherr) x [l] liking (like, neutral, dislike)
    let practice_block = [
        {ratee: 'you',    liking: 'practice_neutral'}
        ];
    
    let neutral_block1 = _.shuffle([
        {ratee: 'other',  liking: 'like'},
        {ratee: 'you',    liking: 'neutral'}
        ]);
        
    let neutral_block2 = _.shuffle([
        {ratee: 'other',  liking: 'neutral'},
        {ratee: 'you',    liking: 'like'}
        ]);

    let negative_block = _.shuffle([
        {ratee: 'other',  liking: 'dislike'},
        {ratee: 'you',    liking: 'dislike'}
        ]);
    let positive_block = _.shuffle([
        {ratee: 'you',    liking: 'like'},
        {ratee: 'other',  liking: 'like'}
        ]);
        
    let block_design = practice_block.concat(
        neutral_block1,
        negative_block,
        positive_block,
        neutral_block2
        );

// Function to initialize the slider for general use
function setup_sliders(){
    let slider_options = {
        min: 0, max: 100, value: 0,
        step: 1, ticks: [0, 50, 100],
        ticks_labels : ['', '', '']
    };
    $('#slider-resp').slider(slider_options);
    $('#slider-prac-resp').slider(slider_options);
    $('#slider-eval').slider(slider_options);
}

// We break the logic of the task up into individual functions, named
// using CapsCase. Each function either calls the next one
// immmediately, calls it after a delay, or tells the page to wait for
// some user input before triggering the next function.

// For full screen
// Enter fullscreen mode
function enterFullscreen() {
  var element = document.documentElement;
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

function Ready() {
    // If you need to do any logic before begining, put it here.
    console.log('Ready');
    window.addEventListener('load', enterFullscreen);
    if (screenfull.isEnabled) { screenfull.request(); }
    state.t_start_experiment = Date.now();
    globals = update_pars_from_urls(globals); // Check for special url parameters
    $('input').val('');
    $('#gorilla').children().hide();
    $('#gorilla').show();
    on_resize();                                    // Check window size now
    $(window).resize(_.debounce(on_resize, 100)); // And every time it changes
    $('#btn-start').show();  // Show the button
    $('#error-message').hide().text(''); // Hide error message
    let avatar_list = _.flatten([globals.player_avatars, globals.other_avatars]);
    let avatar_paths = avatar_list.map(name => 'stimuli/' + name + '.png');
    preload(globals.avatar_paths);
    globals.all_images = _.shuffle(avatar_paths);
    globals.design = block_design;
    setup_sliders();
    PrepareStart();
    globals.pavlovia.start();
    // ShowSetup();
    // $('#btn-start').one('click', PrepareTrial);
    // PrepareTrial();
}

function PrepareStart() {
   if (window.innerWidth < window.innerHeight) {
        alert('Please rotate your device to landscape mode to continue. If you cannot rotate the screen, please change your setting to remove portrait lock. After you do this, refresh the page and try again.');
        document.body.innerHTML = '';
        throw new Error('Please rotate your device to landscape mode to continue. If you cannot rotate the screen, please change your setting to remove portrait lock. After you do this, refresh the page and try again.');
    }
    
    // Show the start section
    $('#start').show();       
    $('#btn-start').show();
    $('#error-message').hide().text(''); // Hide error message

    // Bind click event to #btn-start button
    $('#btn-start').one('click', function () {
        // Call check_subject_nr() when the button is clicked
        check_subject_nr();
    });
}

function check_subject_nr() {
    // Get the participant number from the input field
    let participantNumber = $('#subject-nr').val().trim(); // get rid of empty spaces

    // Check if the participant number is valid
    let is_valid = validParticipants.includes(participantNumber);

    // Show or hide the button based on validity
    if (is_valid) {
        state.subject_nr = participantNumber;
        DoSetup(); // Proceed to the next stage
    } else {
        $('#error-message').show().text("The ID you gave doesn't match the ones we expect, please check it's correct, refresh your browser, and try again.");
    }
}

function DoSetup() {
    if (screenfull.isEnabled) { screenfull.request(); }
    // $('input[type=text]').val(''); // Clear data
    state.subject_nr = $('#subject-nr').val();
    let avatars = _.shuffle(globals.player_avatars);
    
    avatars.map(avt => {
        let el = $(`<label> <input type="radio" name="avatar" value="${avt}"> <img src="stimuli/${avt}.png"> </label>`);
        $('#avatar-select').append(el);
    });
    
    $('#start').hide();
    $('#setup').show();
    
    // Don't show the button until everything has been completed
    $('#btn-setup').one('click', StartExperiment).hide();
    $('#setup').on('change keyup', check_setup);
}

function check_setup() {
    let avatar = $('input[name=avatar]:checked').val();
    
    if (avatar !== undefined) {
        $('#btn-setup').show();
    }
}

function StartExperiment(){
    console.log('StartExperiment() called'); // Add this line
    state.t_start_experiment = Date.now();
    state.participant_avatar_file = $('input[name=avatar]:checked').attr('value');
    globals.player_avatar_info = get_avatar_info(state.participant_avatar_file);
    state.participant_avatar_gender = globals.player_avatar_info.gender[0]; // 'm' or 'f'
    // Other ratee should be same gender as participant.
    let available_avatars = globals.other_avatars;
    let available_ratees = available_avatars
        .filter(name => name[0] == state.participant_avatar_gender);
    let ratee = get_avatar_info(_.sample(_.shuffle(available_ratees)));
    state.other_ratee_name = ratee.name;
    state.other_ratee_file = ratee.file;
    // Everyone else can be a rater
    let available_raters = available_avatars
        .filter( name => name != state.other_ratee_file );
    globals.rater_avatars = _.shuffle(available_raters);
    // Debug
    console.log([available_ratees, ratee, available_raters]);
    globals.likes_on_left = _.shuffle(repeat([0, 1], globals.n_blocks/2));
    CoverStory(); // Call CoverStory() here
}

function CoverStory(){
    console.log('CoverStory');
    state.block_nr = 0;
    $('#setup').hide();
    $('#avatar_profile').hide();
    $('#cover-story').show();
    $('#btn-begin1').one('click', StartBlock);
}

// Define function for repeated avatar presentation
function findWithAttr(array, attr, value) {
        if(array[attr] === value) {
            return 1;
        } else {
            return 0;
        }
    }

function StartBlock(){
    console.log('StartBlock');
    $('#attentional_check1').hide();
    $('#attentional_check2').hide();
    $('#cover-story').hide();
    $('#few-weeks-later').hide();
    $('#formal-experiment-start').hide();
    state.t_start_block = Date.now();
    let b = state.block_nr;
    $('#block_nr').text(b);
    let design = globals.design[b];
    state.ratee_type = design.ratee; // 'you' or 'other'
    state.liking = design.liking;
    let rater = '';
    let rater_img = '';
    if(state.block_nr == 5 && design.ratee == 'you' && findWithAttr(block_design[3], 'ratee', 'you') == 1){
      rater = get_avatar_info(globals.rater_avatars[3]),
      rater_img = globals.rater_avatars[3];
    } else if (state.block_nr == 5 && design.ratee == 'you' && findWithAttr(block_design[4], 'ratee', 'you') == 1){
      rater = get_avatar_info(globals.rater_avatars[4]),
      rater_img = globals.rater_avatars[4];
    } else if (state.block_nr == 5 && design.ratee == 'other' && findWithAttr(block_design[3], 'ratee', 'other') == 1){
      rater = get_avatar_info(globals.rater_avatars[3]),
      rater_img = globals.rater_avatars[3];
    } else if (state.block_nr == 5 && design.ratee == 'other' && findWithAttr(block_design[4], 'ratee', 'other') == 1){
      rater = get_avatar_info(globals.rater_avatars[4]),
      rater_img = globals.rater_avatars[4];
    } else if (state.block_nr == 6 && design.ratee == 'you' && findWithAttr(block_design[3], 'ratee', 'you') == 1){
      rater = get_avatar_info(globals.rater_avatars[3]),
      rater_img = globals.rater_avatars[3];
    } else if (state.block_nr == 6 && design.ratee == 'you' && findWithAttr(block_design[4], 'ratee', 'you') == 1){
      rater = get_avatar_info(globals.rater_avatars[4]),
      rater_img = globals.rater_avatars[4];
    } else if (state.block_nr == 6 && design.ratee == 'other' && findWithAttr(block_design[3], 'ratee', 'other') == 1){
      rater = get_avatar_info(globals.rater_avatars[3]),
      rater_img = globals.rater_avatars[3];
    } else if (state.block_nr == 6 && design.ratee == 'other' && findWithAttr(block_design[4], 'ratee', 'other') == 1){
      rater = get_avatar_info(globals.rater_avatars[4]),
      rater_img = globals.rater_avatars[4];
    } 
    else{
      rater = get_avatar_info(globals.rater_avatars[b]),
      rater_img = globals.rater_avatars[b];
    }
    state.rater_name = rater.name;
    state.rater_file = rater.file;
    $('.rater-name').text(state.rater_name);
    $('.rater-img').attr('src', `stimuli/${rater_img}.png`);
    if(state.ratee_type == 'you') {
        $('.ref-img').attr('src', `stimuli/${state.participant_avatar_file}.png`);
        $('.ref-name').text('you');
    } else {
        $('.ref-img').attr('src', `stimuli/${state.other_ratee_file}.png`);
        $('.ref-name').text(state.other_ratee_name);
    };
    
 // Set up word lists
   //Set up word bucket
    let WORDS_loop = WORDS_group4.concat(WORDS_group1, WORDS_group2, WORDS_group3, WORDS_group4, WORDS_group1, WORDS_group2, WORDS_group3, WORDS_group4);

    let fb = globals.feedback_rules[state.liking];
    globals.positive_correct = _.shuffle(repeat([1, 0], [fb.pos, fb.neg]));
    let nt = globals.n_trials;
    globals.positive_left = _.shuffle(repeat([1, 0], [nt/2, nt/2]));
    if(state.block_nr == 0){
    globals.word_pairs = _.shuffle(WORDS_loop.slice(0,6));
    } else if(state.block_nr == 1){
    globals.word_pairs = _.shuffle(WORDS_loop.slice(nt,2*nt));
    } else if(state.block_nr == 2){
    globals.word_pairs = _.shuffle(WORDS_loop.slice(2*nt,3*nt));
    } else if(state.block_nr == 3){
    globals.word_pairs = _.shuffle(WORDS_loop.slice(3*nt,4*nt));
    } else if(state.block_nr == 4){
    globals.word_pairs = _.shuffle(WORDS_loop.slice(4*nt,5*nt));
    } else if(state.block_nr == 5){
    globals.word_pairs = _.shuffle(WORDS_loop.slice(5*nt,6*nt));
    } else if(state.block_nr == 6){
    globals.word_pairs = _.shuffle(WORDS_loop.slice(6*nt,7*nt));
    } else if(state.block_nr == 7){
    globals.word_pairs = _.shuffle(WORDS_loop.slice(7*nt,8*nt));
    } else if(state.block_nr == 8){
    globals.word_pairs = _.shuffle(WORDS_loop.slice(8*nt,9*nt));
    }
    // Set these to blank to keep data file clean
    state.likes_on_left = null;
    state.evaluation = null;
    state.t_ask_eval = null;
    state.t_eval_resp = null;
    // Animate in the properties
    // HERE HERE
    let children = $('#start-block').children().addClass('hidden');
    // let els_to_show = children.slice(0, 3); // Always show avatars
    
let els_to_show = [0, 1, 2, 3, 4, 5].map(i => $('#instr' + i)[0]);
if (state.block_nr == 0) {
  // First block
  $('#instr0').show();
  $('#instr1').hide();
  $('#instr5').hide();
  els_to_show.push($('#instr4')[0]);
  $('#btn-self').one('click', FurtherInstructions1);
} else {
  $('#instr0').hide();
  $('#instr4').hide();
  $('#instr1').show();
  $('#instr5').show();
  els_to_show.push($('#instr5')[0]);
  $('#btn-begin').show().one('click', StartTrial);
}

for (let i = 0; i < els_to_show.length; i++) {
  let delay = (i === 0 || i === 1 || i === 2) && (state.block_nr == 0 || state.block_nr == 1) ? 1100 : globals.animation_delay;
  setTimeout(() => {
    let el = $(els_to_show[i]);
    el.removeClass('hidden');
  }, delay * i);
}

  $('#start-block').show();
  $('#btn-block').one('click', StartTrial);
  setTimeout(() => $(els_to_show[0]).removeClass('hidden'), 25); // Delay for instr0
}

function FurtherInstructions1() {
  console.log('FurtherInstructions');
  $('#instr4').hide();
  $('#start-block').hide();
  $('.scale-img-1').attr('src', 'stimuli/stimuli_slider_example_1.png');
  $('.scale-img-2').attr('src', 'stimuli/stimuli_slider_example_2.png');
  $('.scale-img-3').attr('src', 'stimuli/stimuli_slider_example_3.png');
  $('.scale-img-4').attr('src', 'stimuli/stimuli_slider_example_4.png');
  jQuery('#scale-img-1').bind('load', function() {
    jQuery('div').imagefit();
  });
  jQuery('#scale-img-2').bind('load', function() {
    jQuery('div').imagefit();
  });
  jQuery('#scale-img-3').bind('load', function() {
    jQuery('div').imagefit();
  });
  jQuery('#scale-img-4').bind('load', function() {
    jQuery('div').imagefit();
  });
  $('#full-instructions').show();
  $('#btn-begin2').one('click', FurtherInstructions2); // Update the click event to call FurtherInstructions2
}

function FurtherInstructions2() {
  console.log('FurtherInstructions2');
  $('#full-instructions').hide(); // Hide the first set of instructions
  $('#full-instructions2').show();
  $('#btn-begin3').one('click', FurtherInstructions3); // Update the click event to call StartTrial
}

function FurtherInstructions3() {
  console.log('FurtherInstructions3');
  $('#full-instructions2').hide(); // Hide the second set of instructions
  $('#full-instructions3').show();
  $('#btn-begin4').one('click', FurtherInstructions4); // Update the click event to call StartTrial
}

function FurtherInstructions4() {
  console.log('FurtherInstructions4');
  $('#full-instructions3').hide(); // Hide the third set of instructions
  $('#full-instructions4').show();
  $('#btn-begin5').one('click', StartTrial); // Update the click event to call StartTrial
}

function StartTrial() {
  if (state.block_nr !== 0) {
    console.log('StartTrial');
    state.t_start_trial = Date.now();
    let n = state.trial_nr;
    // Set variables
    state.positive_left = globals.positive_left[n];
    state.positive_correct = globals.positive_correct[n];
    let word_pair = globals.word_pairs[n];
    state.pos_word = word_pair.pos;
    state.neg_word = word_pair.neg;
    state.correct_word = state.positive_correct ? state.pos_word : state.neg_word;
    // Show info
    if (state.positive_left) {
      state.left_word = state.pos_word;
      state.right_word = state.neg_word;
    } else {
      state.left_word = state.neg_word;
      state.right_word = state.pos_word;
    }
    $('.left-word').text(state.left_word).removeClass('circled');
    $('.right-word').text(state.right_word).removeClass('circled');
    $('.instructions').hide();
    $('#feedback-div').hide();
    $('#question-div').removeClass('faded');
    $('#task').show();
    let slider_ticks = $('#pretty-slider-resp').find('.slider-tick-label').removeClass('circled');
    $(slider_ticks[0]).html(`${state.left_word}`);
    $(slider_ticks[1]).html(` `);
    $(slider_ticks[2]).html(`${state.right_word}`);
    $('#slider-resp').slider('refresh').slider('enable');
    $('#btn-resp').hide();
    setTimeout(() => {
      $('#btn-resp').show().one('click', HandleResponse);
    }, 1000);
  } else {
    console.log('StartTrial');
    state.t_start_trial = Date.now();
    let n = state.trial_nr;
    // Set variables
    state.positive_left = globals.positive_left[n];
    state.positive_correct = globals.positive_correct[n];
    let word_pair = globals.word_pairs[n];
    state.pos_word = word_pair.pos;
    state.neg_word = word_pair.neg;
    state.correct_word = state.positive_correct ? state.pos_word : state.neg_word;
    // Show info
    if (state.positive_left) {
      state.left_word = state.pos_word;
      state.right_word = state.neg_word;
    } else {
      state.left_word = state.neg_word;
      state.right_word = state.pos_word;
    }
    $('.left-word').text(state.left_word).removeClass('circled');
    $('.right-word').text(state.right_word).removeClass('circled');
    $('.instructions').hide();
    $('#feedback-prac-div').hide();
    $('#question-prac-div').removeClass('faded');
    $('#practice').show();
    let slider_ticks = $('#pretty-slider-prac-resp').find('.slider-tick-label').removeClass('circled');
    $(slider_ticks[0]).html(`${state.left_word}`);
    $(slider_ticks[1]).html(` `);
    $(slider_ticks[2]).html(`${state.right_word}`);
    $('#slider-prac-resp').slider('refresh').slider('enable');
    $('#btn-prac-resp').hide();
    setTimeout(() => {
      $('#btn-prac-resp').show().one('click', HandleResponse);
    }, 1000);
  }
}

function HandleResponse(e) {
  if (state.block_nr !== 0) {
    state.t_response = Date.now();
    state.response = $('#slider-resp').val();
    $('#slider-resp').slider('disable');
    let chose_left = Number(state.response) < 50;
    state.choice = chose_left ? state.left_word : state.right_word;
    state.chose_positive = state.choice == state.pos_word;
    state.accuracy = state.choice == state.correct_word;

    // Show feedback
    let slider_ticks = $('#pretty-slider-resp').find('.slider-tick-label').removeClass('circled');
    let to_circle = (state.accuracy == chose_left)
      ? $('.left-word') // If matching, left was correct
      : $('.right-word'); // Otherwise, right
    $(to_circle).addClass('circled');
    // let this_outcome = state.accuracy ? '#tick' : '#cross';
    $('.outcome').hide(); // Let's not show any outcome feedback.
    let name = state.ratee_type == 'you' ? 'you' : state.other_ratee_name;
    // $(this_outcome).show();
    // let middle = state.ratee_type == 'you' ? 'you are' : state.ratee + ' is';
    let txt = `${state.rater_name} finds ${name} ${state.correct_word}.`;
    $('#feedback-text').text(txt);
    $('#question-div').addClass('faded');
    $('#feedback-div').show();
    setTimeout(() => {
      EndTrial();
    }, 1100);
  } else {
    state.t_response = Date.now();
    state.response = $('#slider-prac-resp').val();
    $('#slider-prac-resp').slider('disable');
    let chose_left = Number(state.response) < 50;
    state.choice = chose_left ? state.left_word : state.right_word;
    state.chose_positive = state.choice == state.pos_word;
    state.accuracy = state.choice == state.correct_word;

    // Show feedback
    let slider_ticks = $('#pretty-slider-prac-resp').find('.slider-tick-label').removeClass('circled');

    // let this_outcome = state.accuracy ? '#tick' : '#cross';
    $('.outcome').hide(); // Let's not show any outcome feedback.
    let name = state.ratee_type == 'you' ? 'you' : state.other_ratee_name;
    // $(this_outcome).show();
    // let middle = state.ratee_type == 'you' ? 'you are' : state.ratee + ' is';
    let txt = `In the real rounds, you will get feedback after you make your choice.`;
    $('#feedback-prac-text').text(txt);
    $('#question-prac-div').addClass('faded');
    $('#feedback-prac-div').show();
    $('#btn-prac').one('click', EndTrial);

  }
}

function EndTrial(){
    $('#task').hide();
    $('#practice').hide();
    console.log(state.trial_nr);
    if (state.block_nr == 0 && state.trial_nr >= 0){
        state.trial_nr = -1; // Evaluation rows in the data aren't trials
        EndBlock();
    } else if (state.trial_nr >= globals.n_trials - 1){
        state.trial_nr = 20; // 20 trials per block
        AskEval();
    } else {
        globals.pavlovia.save(state);
        state.trial_nr += 1;
        StartTrial();
    }
}

function AskEval(){
    console.log('AskEval');
    state.t_ask_eval = Date.now();
    let likes_on_left = state.likes_on_left = globals.likes_on_left[state.block_nr];
    let left, right;
    if (likes_on_left) {
        left = 'Like', right = 'Dislike';
    } else {
        left = 'Dislike', right = 'Like';
    }
    $('#evaluation').show();
    let slider_ticks = $('#pretty-slider-eval').find('.slider-tick-label');
    $(slider_ticks[0]).html(`Never`);
    $(slider_ticks[1]).html(` `);
    $(slider_ticks[2]).html(`Always`);
    // $(slider_ticks[0]).text(left);
    // $(slider_ticks[1]).text('');
    // $(slider_ticks[2]).text(right);
    $('#slider-eval').slider('refresh');
    $('#btn-done').one('click', EndBlock);
}

function EndBlock(){
    state.evaluation = $('#slider-eval').val();
    state.t_eval_resp = Date.now();
    $('#evaluation').hide();
    // NB: Double check this is appropriate way of logging
        globals.pavlovia.save(state);
        state.block_nr += 1;
        state.trial_nr = 0;
        
    if(state.block_nr >= globals.n_blocks - 1){
        ShowOtherAvatarSelection_self();
    } else {
        Transitional();
    }
}

function Transitional(){
    console.log('Transitional');
  if (state.block_nr == 1){
    $('#formal-experiment-start').show();
    $('#btn-formal').one('click', StartBlock);
  } else if (state.block_nr === 5){
    $('#few-weeks-later').show();
    $('#btn-extra').one('click', StartBlock);
  } else if (state.block_nr === 2 || state.block_nr == 6){
    AttentionalCheck();
  } else {
    StartBlock();
  }
}

function AttentionalCheck() {
  console.log('AttentionalCheck');

  if (state.block_nr === 2) {
    $('#attentional_check1').show();
    let slider_ticks = $('#pretty-slider-attentional-check1').find('.slider-tick-label');
    $(slider_ticks[0]).html(`0`);
    $(slider_ticks[1]).html(` `);
    $(slider_ticks[2]).html(`100`);

    $('#slider-attentional-check1').slider({
      min: 0,
      max: 100,
      value: 50,
      step: 1,
      ticks: [0, 25, 50, 75, 100],
      ticks_labels: ['0', '', '50', '', '100']
    });

    $('#btn-attentional-check1').one('click', function() {
      let attentional_check1 = $('#slider-attentional-check1').val();
      state.attentional_check1 = attentional_check1;
      ProceedToBlock();
    });
  }

  if (state.block_nr === 6) {
    $('#attentional_check2').show();
    let slider_ticks = $('#pretty-slider-attentional-check2').find('.slider-tick-label');
    $(slider_ticks[0]).html(`0`);
    $(slider_ticks[1]).html(` `);
    $(slider_ticks[2]).html(`50`);
    $(slider_ticks[3]).html(` `);
    $(slider_ticks[4]).html(`100`);

    $('#slider-attentional-check2').slider({
      min: 0,
      max: 100,
      value: 50,
      step: 1,
      ticks: [0, 25, 50, 75, 100],
      ticks_labels: ['0', '', '50', '', '100']
    });

    $('#btn-attentional-check2').one('click', function() {
      let attentional_check2 = $('#slider-attentional-check2').val();
      state.attentional_check2 = attentional_check2;
      checkAttentionalChecks();
    });
  }
}

function checkAttentionalChecks() {
  let isCorrect = (state.attentional_check1 === "100" || state.attentional_check2 === "0");

  if (isCorrect) {
    ProceedToBlock();
  } else {
    state.block_nr = -999;
    globals.pavlovia.save(state);
    FailExperiment();
  }
}

function ProceedToBlock() {
  // Hide attentional check elements
  $('#attentional_check1').hide();
  $('#attentional_check2').hide();

  // Proceed to the next block
  StartBlock();
}

function ShowOtherAvatarSelection_self() {
  console.log('ShowOtherAvatarSelection_self');

  // Hide buttons not needed
  $('#btn-selection-end-self').hide();
  $('#btn-end-self').hide();

  // Set reference image and label for self
  $('.ref-img').attr('src', `stimuli/${state.participant_avatar_file}.png`);
  $('.ref-name').text('you');

  // Shuffle avatars and display options
  let avatars = _.shuffle(globals.rater_avatars);
  $('#avatar-select-end-self').empty();
  avatars.map(avt => {
    let el = $(`<label><input type="radio" name="avatar" value="${avt}"> <img src="stimuli/${avt}.png"></label>`);
    $('#avatar-select-end-self').append(el);
  });

  // Show selection area
  $('#selection-end-self').show();

  // Highlight selected avatar and show next button
  $('#avatar-select-end-self input').on('change', function () {
    $('#avatar-select-end-self input').parent().removeClass('selected-avatar');
    $(this).parent().addClass('selected-avatar');
    $('#btn-selection-end-self').show();
  });

  // On avatar selection confirmation
  $('#btn-selection-end-self').one('click', function () {
    let avatar = $('input[name=avatar]:checked').val();
    state.avatar_selected_self_file = avatar ? get_avatar_info(avatar).file : null;
    $('#selection-end-self').hide();
    ShowOtherAvatarSelection_other(); // Proceed to next screen
  });
}

function ShowOtherAvatarSelection_other() {
  console.log('ShowOtherAvatarSelection_other');

  // Hide previous screens
  $('#btn-selection-end-other').hide();
  $('#btn-end-other').hide();
  $('#selection-end-self').hide();

  // Set reference image and name
  $('.ref-img').attr('src', `stimuli/${state.other_ratee_file}.png`);
  $('.ref-name').text(state.other_ratee_name);

  // Display shuffled avatars
  let avatars = _.shuffle(globals.rater_avatars);
  $('#avatar-select-end-other').empty();
  avatars.map(avt => {
    let el = $(`<label><input type="radio" name="avatar" value="${avt}"> <img src="stimuli/${avt}.png"></label>`);
    $('#avatar-select-end-other').append(el);
  });

  $('#selection-end-other').show();

  $('#avatar-select-end-other input').on('change', function () {
    $('#avatar-select-end-other input').parent().removeClass('selected-avatar');
    $(this).parent().addClass('selected-avatar');
    $('#btn-selection-end-other').show();
  });

  $('#btn-selection-end-other').one('click', function () {
    let avatar = $('input[name=avatar]:checked').val();
    state.avatar_selected_other_file = avatar ? get_avatar_info(avatar).file : null;

    // Mark this block as non-task (exclude from analysis)
    state.block_nr = -999;
    state.trial_nr = -999;

    // Clear unrelated task fields to avoid populating the output
    Object.assign(state, {
      rater_name: '',
      rater_file: '',
      ratee_type: '',
      other_ratee_name: '',
      other_ratee_file: '',
      liking: '',
      positive_left: '',
      positive_correct: '',
      pos_word: '',
      neg_word: '',
      correct_word: '',
      left_word: '',
      right_word: '',
      response: '',
      choice: '',
      chose_positive: '',
      accuracy: '',
      t_start_experiment: '',
      t_start_block: '',
      t_start_trial: '',
      t_response: '',
      likes_on_left: '',
      evaluation: '',
      t_ask_eval: '',
      t_eval_resp: ''
    });

    // Save and finish
    globals.pavlovia.save(state);
    EndExperiment();
  });
}


function EndExperiment(){
    console.log('EndExperiment');
    $('#attentional_check2').hide();
    $('#selection-end-self').hide();
    $('#selection-end-other').hide();
    $('#end').show();
    globals.pavlovia.finish();
    screenfull.exit();
}

function FailExperiment(){
    console.log('EndExperiment');
    $('#attentional_check2').hide();
    $('#selection-end-self').hide();
    $('#selection-end-other').hide();
    $('#fail').show();
    globals.pavlovia.finish();
    screenfull.exit();
}

function createDataRow() {
    return {
        // Participant info (always included)
        subject_nr: state.subject_nr || '',
        participant_avatar_file: state.participant_avatar_file || '',
        participant_avatar_gender: state.participant_avatar_gender || '',
        
        // Block info
        block_nr: state.block_nr || 0,
        trial_nr: state.trial_nr || 0,
        ratee_type: state.ratee_type || '',
        rater_name: state.rater_name || '',
        rater_file: state.rater_file || '',
        other_ratee_name: state.other_ratee_name || '',
        other_ratee_file: state.other_ratee_file || '',
        liking: state.liking || '',
        
        // Trial data
        positive_left: state.positive_left !== null ? state.positive_left : '',
        positive_correct: state.positive_correct !== null ? state.positive_correct : '',
        pos_word: state.pos_word || '',
        neg_word: state.neg_word || '',
        correct_word: state.correct_word || '',
        left_word: state.left_word || '',
        right_word: state.right_word || '',
        response: state.response !== null ? state.response : '',
        choice: state.choice || '',
        chose_positive: state.chose_positive !== null ? state.chose_positive : '',
        accuracy: state.accuracy !== null ? state.accuracy : '',
        
        // Timestamps
        t_start_experiment: state.t_start_experiment || '',
        t_start_block: state.t_start_block || '',
        t_start_trial: state.t_start_trial || '',
        t_response: state.t_response || '',
        
        // End of block data
        likes_on_left: state.likes_on_left !== null ? state.likes_on_left : '',
        evaluation: state.evaluation !== null ? state.evaluation : '',
        t_ask_eval: state.t_ask_eval || '',
        t_eval_resp: state.t_eval_resp || '',
        
        // Attentional checks
        attentional_check1: state.attentional_check1 !== null ? state.attentional_check1 : '',
        attentional_check2: state.attentional_check2 !== null ? state.attentional_check2 : '',
        
        // Final selections
        avatar_selected_self_file: state.avatar_selected_self_file || '',
        avatar_selected_other_file: state.avatar_selected_other_file || '',
        
        // Window dimensions
        width: state.width || '',
        height: state.height || ''
    };
}

// Replace your existing save calls with this function
function saveStructuredData() {
    const dataRow = createDataRow();
    globals.pavlovia.save(dataRow);
}

// How to integrate with your existing functions:
// Simply replace globals.pavlovia.save(state) with saveStructuredData() in these locations:

// 1. In your existing EndTrial() function, replace:
//    globals.pavlovia.save(state); 
//    with: saveStructuredData();

// 2. In your existing EndBlock() function, replace:
//    globals.pavlovia.save(state);
//    with: saveStructuredData();

// 3. In your existing ShowOtherAvatarSelection_other() function, replace:
//    globals.pavlovia.save(state);
//    with: saveStructuredData();

// 4. In your existing checkAttentionalChecks() function, replace:
//    globals.pavlovia.save(state);
//    with: saveStructuredData();

// Optional: Create a header row for CSV export
function getDataHeaders() {
    return [
        'subject_nr', 'participant_avatar_file', 'participant_avatar_gender',
        'block_nr', 'trial_nr', 'ratee_type', 'rater_name', 'rater_file',
        'other_ratee_name', 'other_ratee_file', 'liking',
        'positive_left', 'positive_correct', 'pos_word', 'neg_word', 'correct_word',
        'left_word', 'right_word', 'response', 'choice', 'chose_positive', 'accuracy',
        't_start_experiment', 't_start_block', 't_start_trial', 't_response',
        'likes_on_left', 'evaluation', 't_ask_eval', 't_eval_resp',
        'attentional_check1', 'attentional_check2',
        'avatar_selected_self_file', 'avatar_selected_other_file',
        'width', 'height'
    ];
}
