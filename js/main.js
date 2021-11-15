// Anika

// data saving
const FORMAL = false;
/*const EXPERIMENT_NAME = 'psych_dist';
const PLEDGE_CHECK_SCRIPT = 'php/pledge_check.php';
const PLEDGE_RECORD_SCRIPT = 'php/pledge_record.php';
const SUBJ_NUM_SCRIPT = 'php/subjNum.php';
const SAVING_SCRIPT = 'php/save.php';
const VISIT_FILE = 'visit_' + EXPERIMENT_NAME + '.txt';
const PLEDGE_FILE = 'pledge_' + EXPERIMENT_NAME + '.txt';
const SUBJ_NUM_FILE = 'subjNum_' + EXPERIMENT_NAME + '.txt';
const ATTRITION_FILE = 'attrition_' + EXPERIMENT_NAME + '.txt';
const RATING_FILE = 'rating_' + EXPERIMENT_NAME + '.txt';
const BIF_FILE = 'bif_' + EXPERIMENT_NAME + '.txt'
const SUBJ_FILE = 'subj_' + EXPERIMENT_NAME + '.txt';
const SAVING_DIR = FORMAL ? '../data/formal':'../data/testing'; */




// stimuli
const STIM_PATH = 'stimuli/';
const RATING_PRACTICE_LIST = ['prac'];
const RATING_PRACTICE_TRIAL_N = RATING_PRACTICE_LIST.length;
const RATING_LIST = ['AI1', 'AI2', 'AI3', 'AI4', 'AI5'];
const RATING_IMG_LIST = RANDOMIZE(RATING_LIST);
const RATING_TRIAL_N = RATING_IMG_LIST.length;
const RATING_INSTR_TRIAL_N = RATING_PRACTICE_TRIAL_N + RATING_TRIAL_N;
const INTERTRIAL_INTERVAL = 0.5;
const ALL_IMG_LIST = RATING_PRACTICE_LIST.concat(RATING_LIST);
const BIF_FORM = [
    {question: "Making a list",
    answers: ["Getting organized", "Writing things down"]
    },

    {question: "Reading",
    answers: ["Following lines of print", "Gaining knowledge"]
    },

    {question: "Joining the Army",
    answers: ["Helping the Nation's defense", "Signing up"]
    }
]

var instr, subj, rating;
const VIEWPORT_MIN_W = 800;
const VIEWPORT_MIN_H = 600;
const INSTR_READING_TIME_MIN = 0.75;

$(document).ready(function() {
    subj = new subjObject(subj_options);
    //subj.id = subj.getID(ID_GET_VARIABLE_NAME);
    subj.saveVisit();
    if (subj.phone) {
        HALT_EXPERIMENT('It seems that you are using a touchscreen device or a phone. Please use a laptop or desktop instead.<br /><br />If you believe you have received this message in error, please contact the experimenter at yichiachen@ucla.edu<br /><br />Otherwise, please switch to a laptop or a desktop computer for this experiment.');
    } else {
        LOAD_IMG(0, STIM_PATH, ALL_IMG_LIST, function() {});
        SEARCH_PLEDGE();
    }
});


const SUBJ_TITLES = [
    'num',
    'date',
    'startTime',
    'id',
    'userAgent',
    'endTime',
    'duration',
    'quizAttemptN',
    'instrReadingTimes',
    'quickReadingPageN',
    'hiddenCount',
    'hiddenDurations',
    'serious',
    'problems',
    'gender',
    'age',
    'inView',
    'viewportW',
    'viewportH'
];

function SEARCH_PLEDGE() {
    /*if (subj.id == FREE_PASS_ID) {
        $('#pledge-box').show();
    } else {
        POST_DATA(PLEDGE_CHECK_SCRIPT, { 'directory_path': SAVING_DIR, 'file_name': PLEDGE_FILE, 'worker_id': subj.id}, CHECK_PLEDGE, AJAX_FAILED);
    }*/

    $('#pledge_box').show();
    $('#ratingContainer').hide();
    $('#BIFContainer').hide();
}

function SUBMIT_PLEDGE_Q() {
    const RESP = $('input[name = "pledge"]:checked').val();
    if (CHECK_RESPONSE(RESP)) {
        $('#pledge_box').hide();
        if (RESP == 1) {
            ACCEPT_PLEDGE();
        }
        else {
            REFUSE_PLEDGE();
        }
    }
    else {
        $('#pledge_warning').text('You cannot proceed until you make a selection.')
    }
} 

function ACCEPT_PLEDGE() {
    instr = new instrObject(instr_options);
    //rating_options['subj'] = subj;
    rating = new trialObject(rating_options);
    instr.start();
}

function UPDATE_TRIAL_OBJECT_SUBJ_NUM() {
    if (typeof trial !== 'undefined'){
        trial.num = subj.num;
    }
}

function HANDLE_VISIBILITY_CHANGE() {
    if (document.hidden) {
        subj.hiddenCount += 1;
        subj.hiddenStartTime = Date.now();
    } else  {
        subj.hiddenDurations.push((Date.now() - subj.hiddenStartTime)/1000);
    }
}

function REFUSE_PLEDGE() {
    //POST_DATA(PLEDGE_RECORD_SCRIPT, { 'directory_path': SAVING_DIR, 'file_name': PLEDGE_FILE, 'worker_id': subj.id});
    HALT_EXPERIMENT("It appears that you have reported that you will not read the instructions carefully.")
}

function HALT_EXPERIMENT(explanation) {
    $('.fixedbox').hide();
    $('#instr_text').html(explanation);
    $('#next_button').hide();
    $('#instr_box').show();
}

function AJAX_FAILED() {
    HALT_EXPERIMENT('Oops! An error has occurred. Please submit with the code "AJAX_ERR". Sorry!');
}

var subj_options = {
    titles: SUBJ_TITLES,
    viewportMinW: VIEWPORT_MIN_W,
    viewportMinH: VIEWPORT_MIN_H,
    subjNumCallback: UPDATE_TRIAL_OBJECT_SUBJ_NUM,
    /*subjNumScript: SUBJ_NUM_SCRIPT,
    savingScript: SAVING_SCRIPT,
    subjNumFile: SUBJ_NUM_FILE,
    visitFile: VISIT_FILE,
    attritionFile: ATTRITION_FILE,
    subjFile: SUBJ_FILE,
    savingDir: SAVING_DIR,
    */
    handleVisibilityChange: HANDLE_VISIBILITY_CHANGE
};



const MAIN_INSTRUCTIONS_DICT = {
    0: [false, false, 'Thank you very much!<br></br><br></br>This study will take about 45 minutes. Please read the instructions carefully, and avoid using the refresh or back buttons.'],
    1: [SHOW_MAXIMIZE_WINDOW, false, 'Please maximize your browser window.'],
    2: [HIDE_INSTR_IMG, false, 'The purpose of this experiment is to gauge art appreciation among college students.'],
    3: [false, false, 'In the first half of this experiment, you will be given a short prompt to answer.'],
    4: [false, false, 'In the latter half of this experiment, you will be shown a series of images. Your job is to indicate on a scale of 1 to 6 how visually pleasing the image is to you, with 1 being "not at all" and 6 being "very much".'],
    5: [false, false, "The next page will be a short instruction quiz. (Don't worry, it's very simple!)"],
    6: [false, SHOW_INSTR_QUESTION, ''],
    7: [SHOW_CONSENT, false, "Awesome! You can press SPACE to begin.<br></br><br></br>Please maintain focus, avoid distraction, and try not to switch between other tabs and browsers."]
};

function SHOW_INSTR_IMG(file_name) {
    $('#instr_img').attr('src', STIM_PATH + file_name);
    $('#instr_img').css('display', 'block');
} 

function HIDE_INSTR_IMG() {
    $('#instr_img').css('display', 'none');
}

function SHOW_MAXIMIZE_WINDOW() {
    SHOW_INSTR_IMG('maximize_window.png');
}

function SHOW_INSTR_QUESTION() {
    $('#instr_box').hide();
    $('#quiz_box').show();
}

function SUBMIT_INSTR_Q() {
    const CHOICE = $('input[name = "quiz"]:checked').val();
    if (typeof CHOICE === 'undefined') {
        $('#quiz_warning').text('Please make a selection. Thank you!')
    }
    else if (CHOICE != 'option1') {
        instr.quizAttemptN['onlyQ'] += 1;
        instr.saveReadingTime();
        $('#instr_text').text('You have given an incorrect answer. Please read the instructions again carefully.');
        $('#instr_box').show();
        $('#quiz_box').hide();
        $('input[name = "quiz"]: checked').prop('checked', false);
        instr.index = -1;
    }
    else {
        instr.saveReadingTime();
        instr.next();
        $('#quiz_box').hide();
        SHOW_CONSENT();
    }
}

function SHOW_CONSENT() {
    $('#next_button').hide();
    $('#consent_box').show();
    $(document).keyup(function(e) {
        if (e.code == 'Space') {
            $(document).off('keyup');
            instr.saveReadingTime();
            $('#instr_box').hide();
            //subj.saveAttrition();
            DISTANCE_INDUCTION();
        }
    });
}

var instr_options = {
    textBox: $('#instr_box'),
    textElement: $('#instr_text'),
    dict: MAIN_INSTRUCTIONS_DICT,
    quizConditions: ['onlyQ']
};

const RATING_TITLES = [
    'num',
    'date',
    'subjStartTime',
    'trialNum', 
    'stimName',
    'inView',
    'response',
    'rt'
];

function DISTANCE_INDUCTION() {
    var condition = 0;
    //var condition = subj.num % 2;
    if (condition == 0) {
        $('#tomorrow').show()
    }
    else if (condition == 1) {
        $('#next_year').show()
    }
}

function SHOW_RATING() {
    $('#tomorrow').hide();
    $('#next_year').hide();
    $('#trialBox').show();
    rating.run();
}

function RATING_UPDATE(formal_trial, last, this_trial, next_trial, path) {
    rating.stimName = this_trial;
    $('#trialProgress').text(rating.progress);
    $('#testImg').attr('src', path + this_trial + '.jpg');
    if (!last) {
        $('#bufferImg').attr('src', path + next_trial + '.jpg');
    }
}

function RATING() {
    $('#testImg').show();
    $('#ratingContainer').show();
    $('.ratingButton').mouseup(
        function(event) {
            $('.ratingButton').unbind('mouseup');
            $('#testImg').hide();
            var target = $(event.target).closest('.ratingButton');
            rating.end(target.attr('id'));
        }
    );
}

function END_RATING() {
    $('#trialBox').hide();
    $('#cont_instr').show()
    $(document).keyup(function(e) {
        if (e.code == 'Space') {
            $(document).off('keyup');
            $('#cont_instr').hide();
            BIF_instr();
        }
    });
}

function BIF_instr() {
    $('#BIF_instr').show();
}

function BIF() {
    $('#BIF_instr').hide();
    $('#BIFContainer').show();

    var counter = 0;
    var question = $('#question');
    var currentQ = $('#currentQ')
    var choice1 = $('#answer0')
    var choice2 = $('#answer1')
    addQ();
    
    function addQ() {
        currentQ.text(counter + 1);
        question.text(BIF_FORM[counter].question)
        choice1.text(BIF_FORM[counter].answers[0])
        choice2.text(BIF_FORM[counter].answers[1])
        $('.BIF_ChoiceButton').mouseup(
            function(event) {
                $('.BIF_ChoiceButton').unbind('mouseup');
                var target = $(event.target).closest('.BIF_ChoiceButton');
                if (counter % 2 == 0) {
                    //option 1 = H, option 2 = L
                }
                else {
                    //option 1 = L, option 2 = L
                }
                updateQ();
            }
        );
    }
    
    function updateQ() {
        if(counter != 2){
            counter++;
            addQ();
        }
        else {
            $('#BIFContainer').hide();
            $('#lastQs').show();
            $('#DBQ1').show();
        }
    }
}

function DBQ2() {
    $('#DBQ1').hide();
    $('#DBQ2').show()
}

function DBQ3() {
    $('#DBQ2').hide();
    $('#DBQ3').show();
}

function SUBMIT_DEBRIEFING_Q(){
    $('#lastQs').hide();
    $('#DBQ3').hide();
    $('#END').show();
}

var rating_options = {
    pracTrialN: RATING_PRACTICE_TRIAL_N,
    trialN: RATING_TRIAL_N,
    titles: RATING_TITLES,
    stimPath: 'stimuli/',
    trialList: RATING_IMG_LIST,
    pracList: RATING_PRACTICE_LIST,
    intertrialInterval: 0.5,
    updateFunc: RATING_UPDATE,
    trialFunc: RATING,
    endExptFunc: END_RATING,
    progressInfo: true
}

function RANDOMIZE(input_array) {
    var j, temp;
    var arr = Array.from(input_array);
    for (var i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

