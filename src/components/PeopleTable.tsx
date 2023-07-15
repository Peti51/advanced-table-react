import React, {
  SetStateAction,
  Dispatch,
  useEffect,
} from 'react';
import { Person } from '../types';
import { SortType, PropName } from '../types/enum';
import { SearchLink } from './SearchLink';

interface Props {
  people: Person[],
  handleSort: (value: string) => void,
  sortOrder: SortType,
  sortField: string | null,
  searchParams: URLSearchParams,
  setSearchParams: Dispatch<SetStateAction<URLSearchParams>>,
}

const categoriesSortingMapping: { [key: string]: PropName } = {
  Name: PropName.Name,
  Sex: PropName.Sex,
  Born: PropName.Born,
  Died: PropName.Died,
};

export const PeopleTable: React.FC<Props> = ({
  people,
  handleSort,
  sortOrder,
  sortField,
  searchParams,
  setSearchParams,
}) => {
  const handleSelection = (slug: string | '') => {
    if (slug) {
      searchParams.set('slug', slug);

      setSearchParams(searchParams);
    }
  };

  const location = searchParams.get('slug');

  useEffect(() => {
    const slug = searchParams.get('slug');

    if (slug !== null) {
      handleSelection(slug);
    }
  }, []);

  const categories = ['Name', 'Sex', 'Born', 'Died'];

  return (
    <table
      data-cy="peopleTable"
      className="table is-striped is-hoverable is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          {categories.map((categorie) => {
            return (
              <th>
                <span className="is-flex is-flex-wrap-nowrap">
                  {categorie}
                  <SearchLink
                    onClick={() => {
                      return handleSort(categoriesSortingMapping[categorie]);
                    }}
                    params={{
                      sort: [SortType.Desc].includes(sortOrder)
                        ? null
                        : categoriesSortingMapping[categorie],
                    }}
                  >
                    <span className="icon">
                      {sortOrder === SortType.Asc
                    && sortField === categoriesSortingMapping[categorie]
                    && <i className="fas fa-sort-up" />}
                      {sortOrder === SortType.Desc
                    && sortField === categoriesSortingMapping[categorie]
                    && <i className="fas fa-sort-down" />}
                      {![SortType.Asc, SortType.Desc].includes(sortOrder)
                    && <i className="fas fa-sort" />}
                      {[SortType.Asc, SortType.Desc].includes(sortOrder)
                    && sortField !== categoriesSortingMapping[categorie]
                    && (<i className="fas fa-sort" />)}
                    </span>
                  </SearchLink>
                </span>
              </th>
            );
          })}
          <th>Mother</th>
          <th>Father</th>
        </tr>
      </thead>

      <tbody>

        {people.map((person) => {
          return (
            <tr
              key={person.name}
              className={location === person.slug
                ? 'has-background-warning'
                : ''}
            >
              <td>
                <SearchLink
                  params={{ slug: [String(person.slug)] }}
                  className={person.sex === 'f'
                    ? ('has-text-danger')
                    : ''}
                  role="button"
                  onClick={() => handleSelection(person.slug)}
                >
                  {person.name}
                </SearchLink>
              </td>
              <td>{person.sex}</td>
              <td>{person.born}</td>
              <td>{person.died}</td>
              <td>
                {person.mother !== undefined
                  ? (
                    <SearchLink
                      params={{ slug: String(person.mother?.slug) }}
                      className="has-text-danger"
                      onClick={() => {
                        handleSelection(person.mother?.slug || '');
                      }}
                    >
                      {person.mother?.name}
                    </SearchLink>
                  ) : (
                    <p>
                      {person.motherName}
                    </p>
                  )}
              </td>
              <td>
                {person.father
                  ? (
                    <SearchLink
                      params={{ slug: String(person.father?.slug) }}
                      onClick={() => {
                        handleSelection(person.father?.slug || '');
                      }}
                    >
                      {person.father.name}
                    </SearchLink>
                  ) : (
                    <p>
                      {person.fatherName}
                    </p>
                  )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
