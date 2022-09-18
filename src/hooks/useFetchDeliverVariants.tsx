import { DeliverVariantModel } from '../models/Variant';
import { getProjectLanguages } from '../api/deliver/GetProjectLanguages';
import { getVariants } from '../api/deliver/GetVariants';
import DeliverVariantCard from '../components/deliverVariantCard/DeliverVariantCard';
import { useEffect, useState } from 'react';

export type DeliverVariantCards = {
  readonly language: string;
  readonly variantCards: JSX.Element[];
};

const useFetchDeliverVariants = (projectId: string) => {
  const [variantCards, setVariantCards] = useState<DeliverVariantCards[]>([]);
  const [fetching, setFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const resetErrorMessage = () => {
    if (errorMessage != '') {
      setErrorMessage('');
    }
  };

  useEffect(() => {
    if (projectId === '') {
      return;
    }

    setFetching(true);
    setVariantCards([]);

    getProjectLanguages(projectId)
      .then((languages) => {
        languages?.map((language) => {
          getVariants(projectId, language.codename)
            .then((response) => {
              if (response.ok) return response.json();
              throw response;
            })
            .then((data) => {
              const cards = data.items.map((variantData: DeliverVariantModel) => {
                return (
                  <DeliverVariantCard
                    deliverVariant={variantData}
                    projectId={projectId}
                    itemCodename={variantData.system.codename}
                    variantLanguage={variantData.system.language}
                    key={variantData.system.id}
                  />
                );
              });

              const variantCardWithLanguage: DeliverVariantCards = {
                language: language.name,
                variantCards: cards
              };

              setVariantCards((prev) => prev.concat(variantCardWithLanguage));
              resetErrorMessage();
            });
        });
      })
      .catch((error) => {
        const errorMessage = error.message ?? 'Failed to fetch variants.';
        setErrorMessage('Error: ' + errorMessage);
        console.error(error);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [projectId]);

  return { variantCards, isFetching: fetching, errorMessage };
};

export default useFetchDeliverVariants;
