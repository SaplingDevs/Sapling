import { Dynamic } from '@script-api/sapling.js'
import { world, system } from '@script-api/server.js'

const lang = { EN: {}, ES: {}, PT: {}, CN: {}, JA: {}, DE: {}, FR: {}, KR: {}, IT: {}, RU: {}, TR: {} }
// Declarations

/* English: EN */
lang.EN.invalidValue = '§cInvalid value';
lang.EN.invalidLang = '§cInvalid lang';
lang.EN.invalidFeature = '§cInvalid feature';
lang.EN.invalidAction = '§cInvalid action to repeat';
lang.EN.invalidFakeplayer = '§7You can only manipulate existing players';
lang.EN.fakeplayerConnected = '§7$val are connected'; // $val refers to the name of a player
lang.EN.error = '§cError: $val'; // $val refers to the error
lang.EN.newLang = '§bnew lang set';
lang.EN.enabled = '§7$val enabled'; // $val refers to a function (for example: tntDuping)
lang.EN.disabled = '§7$val disabled'; // $val refers to a function (for example: tntDuping)
lang.EN.prof = '§7Evaluating world data...';
lang.EN.notData = '§7No stored data found';
lang.EN.notAdmin = '§cYou are not admin';
lang.EN.newValue = '§7New value set: $val'; // $val refers to a value

/* Español: ES */
lang.ES.invalidValue = '§cValor inválido';
lang.ES.invalidLang = '§cIdioma inválido';
lang.ES.invalidFeature = '§cFunción inválida';
lang.ES.invalidAction = '§cAcción no repetible';
lang.ES.invalidFakeplayer = '§7Solo puedes manipular jugadores existentes';
lang.ES.fakeplayerConnected = '§7$val están conectados'; // $val se refiere al nombre de un jugador
lang.ES.error = '§cError: $val'; // $val se refiere al error
lang.ES.newLang = '§bNuevo idioma establecido';
lang.ES.enabled = '§7$val activado'; // $val se refiere a una función (por ejemplo: tntDuping)
lang.ES.disabled = '§7$val desactivado'; // $val se refiere a una función (por ejemplo: tntDuping)
lang.ES.prof = '§7Evaluando datos del mundo...';
lang.ES.notData = '§7No se encontraron datos guardados';
lang.ES.notAdmin = '§cNo eres administrador';
lang.ES.newValue = '§7Nuevo valor establecido: $val'; // $val se refiere a un valor

/* Português: PT */
lang.PT.invalidValue = '§cValor inválido';
lang.PT.invalidLang = '§cIdioma inválido';
lang.PT.invalidFeature = '§cRecurso inválido';
lang.PT.invalidAction = '§cAção inválida para repetir';
lang.PT.invalidFakeplayer = '§7Você só pode manipular jogadores existentes';
lang.PT.fakeplayerConnected = '§7$val estão conectados'; // $val se refere ao nome de um jogador
lang.PT.error = '§cErro: $val'; // $val se refere ao erro
lang.PT.newLang = '§bNovo idioma definido';
lang.PT.enabled = '§7$val habilitado'; // $val se refere a uma função (por exemplo: tntDuping)
lang.PT.disabled = '§7$val desabilitado'; // $val se refere a uma função (por exemplo: tntDuping)
lang.PT.prof = '§7Avaliando dados do mundo...';
lang.PT.notData = '§7Nenhum dado armazenado encontrado';
lang.PT.notAdmin = '§cVocê não é administrador';
lang.PT.newValue = '§7Novo valor definido: $val'; // $val se refere a um valor

/* 中文: CN */
lang.CN.invalidValue = '§c无效的值';
lang.CN.invalidLang = '§c无效的语言';
lang.CN.invalidFeature = '§c无效的功能';
lang.CN.invalidAction = '§c无效的重复操作';
lang.CN.invalidFakeplayer = '§7只能操作现有玩家';
lang.CN.fakeplayerConnected = '§7$val 已连接'; // $val 指的是玩家的名字
lang.CN.error = '§c错误：$val'; // $val 指的是错误
lang.CN.newLang = '§b新语言已设置';
lang.CN.enabled = '§7$val 已启用'; // $val 指的是功能（例如：tntDuping）
lang.CN.disabled = '§7$val 已禁用'; // $val 指的是功能（例如：tntDuping）
lang.CN.prof = '§7评估世界数据...';
lang.CN.notData = '§7未找到存储的数据';
lang.CN.notAdmin = '§c你不是管理员';
lang.CN.newValue = '§7新值已设置: $val'; // $val 指的是一个值

/* 日本語: JA */
lang.JA.invalidValue = '§c無効な値';
lang.JA.invalidLang = '§c無効な言語';
lang.JA.invalidFeature = '§c無効な機能';
lang.JA.invalidAction = '§c無効なアクションを繰り返す';
lang.JA.invalidFakeplayer = '§7既存のプレイヤーのみ操作可能です';
lang.JA.fakeplayerConnected = '§7$val が接続されています'; // $val はプレイヤーの名前
lang.JA.error = '§cエラー: $val'; // $val はエラーを指します
lang.JA.newLang = '§b新しい言語が設定されました';
lang.JA.enabled = '§7$val が有効になりました'; // $val は機能（例: tntDuping）
lang.JA.disabled = '§7$val が無効になりました'; // $val は機能（例: tntDuping）
lang.JA.prof = '§7ワールドデータを評価しています...';
lang.JA.notData = '§7保存されたデータが見つかりません';
lang.JA.notAdmin = '§cあなたは管理者ではありません';
lang.JA.newValue = '§7新しい値が設定されました: $val'; // $val は値を指します

/* Deutsch: DE */
lang.DE.invalidValue = '§cUngültiger Wert';
lang.DE.invalidLang = '§cUngültige Sprache';
lang.DE.invalidFeature = '§cUngültiges Feature';
lang.DE.invalidAction = '§cUngültige Aktion zum Wiederholen';
lang.DE.invalidFakeplayer = '§7Nur vorhandene Spieler können manipuliert werden';
lang.DE.fakeplayerConnected = '§7$val sind verbunden'; // $val bezieht sich auf den Namen eines Spielers
lang.DE.error = '§cFehler: $val'; // $val bezieht sich auf den Fehler
lang.DE.newLang = '§bNeue Sprache festgelegt';
lang.DE.enabled = '§7$val aktiviert'; // $val bezieht sich auf eine Funktion (z.B. tntDuping)
lang.DE.disabled = '§7$val deaktiviert'; // $val bezieht sich auf eine Funktion (z.B. tntDuping)
lang.DE.prof = '§7Welt-Daten werden ausgewertet...';
lang.DE.notData = '§7Keine gespeicherten Daten gefunden';
lang.DE.notAdmin = '§cDu bist kein Administrator';
lang.DE.newValue = '§7Neuer Wert gesetzt: $val'; // $val bezieht sich auf einen Wert

/* Français: FR */
lang.FR.invalidValue = '§cValeur invalide';
lang.FR.invalidLang = '§cLangue invalide';
lang.FR.invalidFeature = '§cFonctionnalité invalide';
lang.FR.invalidAction = '§cAction invalide à répéter';
lang.FR.invalidFakeplayer = '§7Vous pouvez uniquement manipuler des joueurs existants';
lang.FR.fakeplayerConnected = '§7$val sont connectés'; // $val fait référence au nom d’un joueur
lang.FR.error = '§cErreur: $val'; // $val fait référence à l’erreur
lang.FR.newLang = '§bNouvelle langue définie';
lang.FR.enabled = '§7$val activé'; // $val fait référence à une fonction (par exemple : tntDuping)
lang.FR.disabled = '§7$val désactivé'; // $val fait référence à une fonction (par exemple : tntDuping)
lang.FR.prof = '§7Évaluation des données du monde...';
lang.FR.notData = '§7Aucune donnée enregistrée trouvée';
lang.FR.notAdmin = '§cVous n’êtes pas administrateur';
lang.FR.newValue = '§7Nouvelle valeur définie: $val'; // $val fait référence à une valeur

/* 한국어: KR */
lang.KR.invalidValue = '§c잘못된 값';
lang.KR.invalidLang = '§c잘못된 언어';
lang.KR.invalidFeature = '§c잘못된 기능';
lang.KR.invalidAction = '§c반복할 수 없는 작업';
lang.KR.invalidFakeplayer = '§7존재하는 플레이어만 조작할 수 있습니다';
lang.KR.fakeplayerConnected = '§7$val이 연결되었습니다'; // $val refers to the player's name
lang.KR.error = '§c오류: $val'; // $val refers to the error
lang.KR.newLang = '§b새 언어가 설정되었습니다';
lang.KR.enabled = '§7$val 활성화됨'; // $val refers to a function (for example: tntDuping)
lang.KR.disabled = '§7$val 비활성화됨'; // $val refers to a function (for example: tntDuping)
lang.KR.prof = '§7세계 데이터를 평가하는 중...';
lang.KR.notData = '§7저장된 데이터가 없습니다';
lang.KR.notAdmin = '§c관리자가 아닙니다';
lang.KR.newValue = '§7새 값이 설정되었습니다: $val'; // $val refers to a value

/* Italiano: IT */
lang.IT.invalidValue = '§cValore non valido';
lang.IT.invalidLang = '§cLingua non valida';
lang.IT.invalidFeature = '§cFunzione non valida';
lang.IT.invalidAction = '§cAzione non valida da ripetere';
lang.IT.invalidFakeplayer = '§7Puoi solo manipolare i giocatori esistenti';
lang.IT.fakeplayerConnected = '§7$val sono connessi'; // $val si riferisce al nome di un giocatore
lang.IT.error = '§cErrore: $val'; // $val si riferisce all'errore
lang.IT.newLang = '§bNuova lingua impostata';
lang.IT.enabled = '§7$val abilitato'; // $val si riferisce a una funzione (ad esempio: tntDuping)
lang.IT.disabled = '§7$val disabilitato'; // $val si riferisce a una funzione (ad esempio: tntDuping)
lang.IT.prof = '§7Valutando i dati del mondo...';
lang.IT.notData = '§7Nessun dato salvato trovato';
lang.IT.notAdmin = '§cNon sei un amministratore';
lang.IT.newValue = '§7Nuovo valore impostato: $val'; // $val si riferisce a un valore

/* Русский: RU */
lang.RU.invalidValue = '§cНедопустимое значение';
lang.RU.invalidLang = '§cНедопустимый язык';
lang.RU.invalidFeature = '§cНедопустимая функция';
lang.RU.invalidAction = '§cНедопустимое действие для повторения';
lang.RU.invalidFakeplayer = '§7Вы можете только манипулировать существующими игроками';
lang.RU.fakeplayerConnected = '§7$val подключены'; // $val относится к имени игрока
lang.RU.error = '§cОшибка: $val'; // $val относится к ошибке
lang.RU.newLang = '§bУстановлен новый язык';
lang.RU.enabled = '§7$val включен'; // $val относится к функции (например: tntDuping)
lang.RU.disabled = '§7$val отключен'; // $val относится к функции (например: tntDuping)
lang.RU.prof = '§7Оценка данных мира...';
lang.RU.notData = '§7Нет сохраненных данных';
lang.RU.notAdmin = '§cВы не администратор';
lang.RU.newValue = '§7Новое значение установлено: $val'; // $val относится к значению

/* Türkçe: TR */
lang.TR.invalidValue = '§cGeçersiz değer';
lang.TR.invalidLang = '§cGeçersiz dil';
lang.TR.invalidFeature = '§cGeçersiz özellik';
lang.TR.invalidAction = '§cTekrarlamak için geçersiz eylem';
lang.TR.invalidFakeplayer = '§7Sadece mevcut oyuncuları manipüle edebilirsiniz';
lang.TR.fakeplayerConnected = '§7$val bağlı'; // $val bir oyuncunun adını ifade eder
lang.TR.error = '§cHata: $val'; // $val hatayı ifade eder
lang.TR.newLang = '§bYeni dil ayarlandı';
lang.TR.enabled = '§7$val etkinleştirildi'; // $val bir işlevi ifade eder (örneğin: tntDuping)
lang.TR.disabled = '§7$val devre dışı bırakıldı'; // $val bir işlevi ifade eder (örneğin: tntDuping)
lang.TR.prof = '§7Dünya verileri değerlendiriliyor...';
lang.TR.notData = '§7Kaydedilen veri bulunamadı';
lang.TR.notAdmin = '§cYönetici değilsiniz';
lang.TR.newValue = '§7Yeni değer ayarlandı: $val'; // $val bir değeri ifade eder


// Lang function
function LANG(key, replace = '', sender = false) {
	const keys = Dynamic.getData('lang') || 'EN';
	const vals = lang[keys];
	
	let txt = vals[key].replace('$val', replace);
	txt = '§7[§l§2Sapling§r§7]§r ' + txt;

	if (sender) system.run(() => sender.runCommand(`tellraw @s { "rawtext": [ { "text": "${txt}" } ] }`));
	else world.sendMessage(txt);
}

// Exports
export { lang };
export default LANG;