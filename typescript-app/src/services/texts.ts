import { LiturgicalDay } from './calendar';

interface BilingualText {
  latin: string;
  english: string;
}

export interface MassProper {
  introit: BilingualText;
  collect: BilingualText;
  epistle: BilingualText;
  gradual: BilingualText;
  alleluia?: BilingualText;
  tract?: BilingualText;
  gospel: BilingualText;
  offertory: BilingualText;
  secret: BilingualText;
  communion: BilingualText;
  postcommunion: BilingualText;
}

export interface OfficeHourProper {
  antiphons: BilingualText[];
  psalms: BilingualText[];
  chapter: BilingualText;
  hymn: BilingualText;
  versicle: BilingualText;
  benedictus?: BilingualText;
  magnificat?: BilingualText;
  nunc?: BilingualText;
  collect: BilingualText;
}

export class LiturgicalTexts {
  static async getMassProper(day: LiturgicalDay): Promise<MassProper> {
    // TODO: Implement proper text fetching logic
    // For now, return placeholder data
    return {
      introit: {
        latin: 'Introibo ad altare Dei',
        english: 'I will go unto the altar of God',
      },
      collect: {
        latin: 'Oremus...',
        english: 'Let us pray...',
      },
      epistle: {
        latin: 'Lectio Epistolae...',
        english: 'A reading from the Epistle...',
      },
      gradual: {
        latin: 'Graduale...',
        english: 'Gradual...',
      },
      gospel: {
        latin: 'Sequentia sancti Evangelii...',
        english: 'A continuation of the Holy Gospel...',
      },
      offertory: {
        latin: 'Offertorium...',
        english: 'Offertory...',
      },
      secret: {
        latin: 'Secreta...',
        english: 'Secret...',
      },
      communion: {
        latin: 'Communio...',
        english: 'Communion...',
      },
      postcommunion: {
        latin: 'Postcommunio...',
        english: 'Post Communion...',
      },
    };
  }

  static async getOfficeHour(day: LiturgicalDay, hour: string): Promise<OfficeHourProper> {
    // TODO: Implement proper text fetching logic
    // For now, return placeholder data
    return {
      antiphons: [
        {
          latin: 'Antiphona...',
          english: 'Antiphon...',
        },
      ],
      psalms: [
        {
          latin: 'Psalmus...',
          english: 'Psalm...',
        },
      ],
      chapter: {
        latin: 'Capitulum...',
        english: 'Chapter...',
      },
      hymn: {
        latin: 'Hymnus...',
        english: 'Hymn...',
      },
      versicle: {
        latin: 'V. Dominus vobiscum.\nR. Et cum spiritu tuo.',
        english: 'V. The Lord be with you.\nR. And with your spirit.',
      },
      collect: {
        latin: 'Oremus...',
        english: 'Let us pray...',
      },
    };
  }
}