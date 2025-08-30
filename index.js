/**
 * Elo rating 計算
 */
const calcElo = (winner1,winner2,winner3 , loser1,loser2,loser3) => {
    const K = $('#kvalue').val(); // K係数
    const winnerScore = 1;
    const loserScore = 0;

    //平均レート
    const winnerRating = (winner1+winner2+winner3) / 3;
    const loserRating  = (loser1 +loser2 +loser3)  / 3;

    // 期待勝率の計算
    const expectedA = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
    const expectedB = 1 - expectedA
    
    // 新しいレーティング ※整数丸め
    const plusRating = Math.round( K * (winnerScore - expectedA)); // 勝者の加算レート
    const minusRating = Math.round( K * (loserScore - expectedB)); // 敗者の引かれるレート
    
    return {
        winner1 : winner1 + plusRating
        ,winner2 : winner2 + plusRating
        ,winner3 :winner3 + plusRating
        ,loser1 : loser1 + minusRating
        ,loser2 : loser2 + minusRating
        ,loser3 : loser3 + minusRating
    }
}

/**
 * 一時データ読み込み
 */
const readTmpData = () => {
    const tmpData = JSON.parse($("#tmp_data").val());
    return tmpData;
}

/**
 * 一時データ書き込み
 */
const saveTmpData = (tmpData) =>{
    $("#tmp_data").val(JSON.stringify(tmpData));
}

/**
 * 初期化
 */
const init = () => {
    const initData = {
        members : []
        ,history : []
    }
    saveTmpData(initData);
}

/**
 * メンバ追加Modal開く
 */
const showAddMemberModal = () => {
    const addMemberModal = $('#addMemberModal');
    addMemberModal.addClass("show");
}

/**
 * メンバ追加Modal閉じる
 */
const closeAddMemberModal = () => {
    const addMemberModal = $('#addMemberModal');
    addMemberModal.removeClass("show");
}

/**
 * メンバ追加
 */
const clickAddMenberButton = () =>{
    addMember( $("#new_name").val() ,parseInt($("#new_rate").val()) );
    renderMemberTable();
    const addMemberModal = $('#addMemberModal');
    addMemberModal.removeClass("show");
}

/** 
 * 新規メンバー登録 
 */
const addMember = (name , rate) => {
    const saveData = readTmpData();
    saveData.members.push({name : name , initialRate : rate , currentRate : rate});
    saveTmpData(saveData);
}

/**
 * メンバー一覧描画
 */
const renderMemberTable = () =>{
    const saveData = readTmpData();
    let table = "";
    saveData.members.forEach(element => {
        table += "<tr><td>"+element.name+"</td><td>"+element.initialRate+"</td><td>"+element.currentRate+"</td></tr>"
    });
    $("#membersList").empty();
    $("#membersList").append(table);
}
/**
 * 履歴一覧描画
 */
const renderHistoryTable = () =>{
    const saveData = readTmpData();
    let table = "";
    saveData.history.forEach(element => {
        //TODO
        table += "<tr><td>"+JSON.stringify(element)+"</td></tr>"
    });
    $("#historiesList").empty();
    $("#historiesList").append(table);
}
/**
 * 勝敗記入モーダル表示
 */
const showBattleResultModal = () =>{
    const saveData = readTmpData();
    let option = "";
    saveData.members.forEach((element,index) => {
        option += '<option value="'+index+'">'+element.name+"</option>"
    });

    $("#winner_name1").empty();
    $("#winner_name1").append(option);
    $("#winner_name2").empty();
    $("#winner_name2").append(option);
    $("#winner_name3").empty();
    $("#winner_name3").append(option);
    $("#loser_name1").empty();
    $("#loser_name1").append(option);
    $("#loser_name2").empty();
    $("#loser_name2").append(option);
    $("#loser_name3").empty();
    $("#loser_name3").append(option);

    const battleResultModal = $('#battleResultModal');
    battleResultModal.addClass("show");
}

/**
 * 勝敗記入モーダル閉じる
 */
const closeBattleResultModal = () =>{
    const battleResultModal = $('#battleResultModal');
    battleResultModal.removeClass("show");
}

/**
 * 勝敗記入モーダル登録
 */
const registBattleResultModal = () =>{
    
    const tmpData = readTmpData();
    
    const winner1index = parseInt($("#winner_name1").val());
    const winner1rate  = tmpData.members[winner1index].currentRate;
    const winner1name  = tmpData.members[winner1index].name;
    
    const winner2index = parseInt($("#winner_name2").val());
    const winner2rate = tmpData.members[winner2index].currentRate;
    const winner2name  = tmpData.members[winner2index].name;
    
    const winner3index = parseInt($("#winner_name3").val());
    const winner3rate = tmpData.members[winner3index].currentRate;
    const winner3name  = tmpData.members[winner3index].name;
    
    const loser1index = parseInt($("#loser_name1").val());
    const loser1rate = tmpData.members[loser1index].currentRate;
    const loser1name  = tmpData.members[loser1index].name;
    
    const loser2index = parseInt($("#loser_name2").val());
    const loser2rate = tmpData.members[loser2index].currentRate;
    const loser2name  = tmpData.members[loser2index].name;
    
    const loser3index = parseInt($("#loser_name3").val());
    const loser3rate = tmpData.members[loser3index].currentRate;
    const loser3name  = tmpData.members[loser3index].name;
    
    if ([...new Set([winner1index,winner2index,winner3index,loser1index,loser2index,loser3index])].length < 6){
        alert('選択した選手に被りがあるようです');
        return;
    }

    //計算
    const result = calcElo(
        winner1rate,winner2rate,winner3rate
        ,loser1rate ,loser2rate,loser3rate
    )
    //メンバー一覧更新
    tmpData.members[winner1index].currentRate=result.winner1;
    tmpData.members[winner2index].currentRate=result.winner2;
    tmpData.members[winner3index].currentRate=result.winner3;
    tmpData.members[loser1index].currentRate =result.loser1;
    tmpData.members[loser2index].currentRate =result.loser2;
    tmpData.members[loser3index].currentRate =result.loser3;
    //履歴挿入
    tmpData.history.push([
        {index: winner1index ,name:winner1name , beforeRate:winner1rate, rate: result.winner1}
        ,{index: winner2index ,name:winner2name , beforeRate:winner2rate, rate: result.winner2}
        ,{index: winner3index ,name:winner3name , beforeRate:winner3rate, rate: result.winner3}
        ,{index: loser1index , name:loser1name , beforeRate:loser1rate, rate: result.loser1}
        ,{index: loser2index ,name:loser2name , beforeRate:loser2rate, rate: result.loser2}
        ,{index: loser3index ,name:loser3name , beforeRate:loser3rate, rate: result.loser3}
    ]);
    
    saveTmpData(tmpData);
    //メンバー一覧描画
    renderMemberTable();
    //履歴再描画
    renderHistoryTable();

    //モーダル閉じる
    closeBattleResultModal();
}

/**
 * セーブボタン押下
 */
const clickSaveButton = () => {
    const savedata = readTmpData();
    const blob = new Blob([JSON.stringify(savedata)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "savedata.txt";
    a.click();

    URL.revokeObjectURL(url); // メモリ解放
}

/**
 * ロードボタン押下 
 */
const clickLoadButton = () => {
    $('#load').click();
}

/**
 * ロードボタンファイル選択後
 * @param {*} event 
 */
const selectLoadButton = async (event) => {
    const text = await event.target.files[0].text();
    saveTmpData(JSON.parse(text));
    renderMemberTable();
    renderHistoryTable();
}

/**
 * 履歴削除ボタン押下
 */
const deleteHistory = () => {

    if (!window.confirm("最新の履歴を1行削除し、レートを戻します。よろしいですか？")){
        return;
    }

    const tmpData = readTmpData();

    if (tmpData.history.length < 1) {
        alert('削除できる履歴がありません');
        return;
    }

    const lastHistory = tmpData.history[tmpData.history.length - 1];
    tmpData.history.pop();

    lastHistory.forEach((e) => {
        tmpData.members[e.index].currentRate = e.beforeRate;
    });
    
    saveTmpData(tmpData);
    renderMemberTable();
    renderHistoryTable();
}

/**
 * K チェックボックス変更
 */
const onclickKCheckBox = () => {
    $('#kvalue').prop('disabled',!$('#kcheckbox').prop('checked'));
}
