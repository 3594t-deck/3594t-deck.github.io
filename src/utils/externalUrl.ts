import { General, AssistGeneral, DefaultAssist } from '3594t-deck';

/**
 * @param {General} general 武将カード
 * @param {boolean} pocket ぽけっと武将ならtrue
 * @return {string} 武将カードのサムネイル画像のURL
 */
export function generalThumbUrl(general: General, pocket: boolean): string {
  const code = pocket && general.hasPocket ? general.pocketCode : general.code;
  return `/data/img/card_small/${code}.jpg`;
}

/**
 * @param {General} general 武将カード
 * @param {boolean} pocket ぽけっと武将ならtrue
 * @return {string} 武将カードのアバター画像のURL
 */
export function generalAvatarUrl(general: General, pocket: boolean): string {
  const code =
    pocket && general.hasPocket ? general.pocketAvatar : general.avatar;
  return `/data/img/avatar/${code}.png`;
}

/**
 * @param {General} general 武将カード
 * @return {string} 武将カードの公式ページURL
 */
export function generalOfficiallUrl(general: General): string {
  return `https://3594t.net/datalist/?v=GENERAL&s=POPUP_GENERAL&c=${general.code}`;
}

/**
 * @param {AssistGeneral} assist 遊軍カード
 * @return {string} 遊軍カードのサムネイル画像のURL
 */
export function assistThumbUrl(assist: AssistGeneral): string {
  return `/data/img/card_small/${assist.code}.jpg`;
}

/**
 * @param {AssistGeneral} assist 遊軍カード
 * @return {string} 遊軍カードのアバター画像のURL
 */
export function assistAvatarUrl(assist: AssistGeneral | DefaultAssist): string {
  return `/data/img/avatar/${assist.avatar}.png`;
}

/**
 * @param {AssistGeneral} assist 遊軍カード
 * @return {string} 遊軍カードの公式ページURL
 */
export function assistOfficiallUrl(assist: AssistGeneral): string {
  return `https://3594t.net/datalist/?v=ASSIST&s=POPUP_ASSIST&c=${assist.code}`;
}

/**
 * @param {string} rangeCode 計略・戦技の範囲code
 * @return {string} 計略・戦技の範囲画像URL
 */
export function strategyRangeImageUrl(rangeCode: string): string {
  return `/data/img/strat_range/${rangeCode}.png`;
}
