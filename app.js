/**
 * Created by fomars on 14/01/15.
 */
var players = {};

function Player(name, balance) {
    this.name = name;
    this.balance = balance;
    this.validate = function() {
        var regexp_name = /^[\w]+$/i,
            regexp_num = /^[0-9]+$/;
        if (0 === this.name.length){
            $('p.error').text("The player's name should not be empty");
            return false
        }
        else if (!regexp_name.test(this.name)){
            $('p.error').text("The player's name should not contain special characters");
            return false
        }
        else if(this.name in players){
            $('p.error').text("This name is already in use");
            return false
        }
        else if(!regexp_num.test(this.balance)){
            $('p.error').text("Balance should be a non-negative number");
            return false
        }
        else {
            this.balance = parseInt(this.balance);
            return true
        }
    }
}


function addNewPlayer(newPlayer) {
    players[newPlayer.name] = newPlayer;

    var DELETE_BUTTON='<button type="button" class="close" aria-label="Delete">' +
        '<span aria-hidden="true">&times;</span></button>';
    var newLine = $('<tr class="user-row">');
    newLine.attr('id', newPlayer.name);

    $('<td>').text(newPlayer.name).appendTo(newLine);
    $('<td class="balance">').text(newPlayer.balance).appendTo(newLine);
    $(DELETE_BUTTON).appendTo($('<td class="delete">').appendTo(newLine));
    newLine.appendTo('table.players');

    $(".name").val('');
    if (Object.keys(players).length == 2){
        $('.start_btn').show()
    }
}

function addBank(){
    var bankName = '_BANK_',
        bankBalance = 15000,
        bank = new Player(bankName, bankBalance);
    var newLine = $('<tr class="user-row bank bg-warning">');
    newLine.attr('id', bank.name);$('<td>').text(bank.name).appendTo(newLine);
    $('<td class="balance">').text(bank.balance).appendTo(newLine);
    newLine.appendTo('table.players');
}

function removePlayer() {
    var userRow = $(this).parents('.user-row');
    delete players[userRow.attr('id')];
    userRow.remove();
    if (Object.keys(players).length == 1) {
        $('.start_btn').hide()
    }
}

var clickAddButton = function(){
    var nameInp = $(".name"),
        newPlayer = new Player(nameInp.val().trim(), $(".balance").val());
    if (newPlayer.validate()){
        addNewPlayer(newPlayer)
    }
    else{
        $('p.error').fadeIn("fast", function(){
            setTimeout(function() {
                $('p.error').fadeOut("slow")
            },2*1000)
        });
    }
};

function toggleAddingForm() {
    $('.new_player').toggle();
    $('.btn-success').toggle();
    $('th.players').toggle();
    $('tr.user-row').toggleClass('potential_payer');
    $('table.players').toggleClass('table-hover');
}

var continueGame = function(){
    toggleAddingForm();
    $('td.delete').hide();
};

var startGame = function(){
    $('.start_btn').attr('value', 'CONTINUE').addClass('continue_btn').removeClass('start_btn');
    addBank();
    continueGame();
};

function start_transaction() {
    var sender = players[$(this).attr('id')];
    var userRow = $(this);
    userRow.toggle();
    $('.potential_payer').addClass('potential_beneficiary').removeClass('potential_payer');
    $('div.from').toggle();
    $('p.playername').text(sender.name);
    $('th.players').text("Select beneficiary:")

}

var main = function() {
    $(".add-btn").click(clickAddButton);

    $('form').keydown(function(event){
    if(event.keyCode == 13) {
        event.preventDefault();
        clickAddButton();
        return false;
        }
    });

    $('.add_new_player_during_game').click(toggleAddingForm);
};

$(document).ready(main);

$(document).on('click', '.close', removePlayer);

$(document).on('click', '.potential_payer', start_transaction);

$(document).on('click', '.start_btn', startGame);

$(document).on('click', '.continue_btn', continueGame);