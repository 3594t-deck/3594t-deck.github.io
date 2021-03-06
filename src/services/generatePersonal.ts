import { Personal, RawPersonal } from '3594t-deck';

export default function (id: string, raw: RawPersonal): Personal {
  return {
    id,
    azana: raw.azana,
    azanaRuby: raw.azana_ruby.replace(/＿/g, ''),
    name: raw.name,
    nameRuby: raw.name_ruby.replace(/＿/g, ''),
    uniqueId: raw.same_person_idx,
    azanaSearchText: {
      text: raw.azana,
      ruby: raw.azana_ruby_search,
    },
    nameSearchText: {
      text: raw.name,
      ruby: raw.name_ruby_search,
    },
  };
}
