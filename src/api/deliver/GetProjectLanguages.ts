import { deliverBaseUrl } from '../../Constants';

export const getProjectLanguages = (projectId: string) => {
  // Get all languages of project
  return fetch(deliverBaseUrl + projectId + '/languages')
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .then((deliverLanguages: DeliverLanguages) => {
      const languages: LanguagesSystem[] = deliverLanguages.languages.map((item) => {
        return item.system;
      });
      return languages;
    });
};

type DeliverLanguages = {
  readonly languages: Languages[];
  readonly pagination: any;
};

type Languages = {
  readonly system: LanguagesSystem;
};

type LanguagesSystem = {
  readonly id: string;
  readonly name: string;
  readonly codename: string;
};

export const getVariantsByProjectId = async (projectId: string) => {
  return fetch(deliverBaseUrl + projectId + '/items-feed');
};
