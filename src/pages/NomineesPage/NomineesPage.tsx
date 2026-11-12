import { useEffect, useState } from 'react'
import { useCategories } from '../../hooks/useCategories'
import { getNominees, ApiError, type NomineeSummary, type Category } from '../../api/client'
import { PublicHeader } from '../../components/PublicHeader/PublicHeader'
import { StarIcon } from '../../components/illustrations/StarIcon/StarIcon'
import styles from './NomineesPage.module.css'

export function NomineesPage() {
  const { categories, loading, error } = useCategories()
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [nominees, setNominees] = useState<NomineeSummary[]>([])
  const [nomineesLoading, setNomineesLoading] = useState(false)
  const [nomineesError, setNomineesError] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedCategory) return
    setNomineesLoading(true)
    setNomineesError(null)
    getNominees(selectedCategory.id)
      .then(setNominees)
      .catch((err) => setNomineesError(err instanceof ApiError ? err.message : 'Failed to load nominees.'))
      .finally(() => setNomineesLoading(false))
  }, [selectedCategory])

  return (
    <div>
      <PublicHeader />

      <section className="page">
        <h1>Nominees</h1>

        {!selectedCategory && (
          <>
            {loading && <p className="page-message">Loading categories…</p>}
            {!loading && error && (
              <p className="page-message">We couldn&apos;t load the categories right now. Please try again shortly.</p>
            )}
            {!loading && !error && categories.length === 0 && (
              <p className="page-message">Categories will be published here soon.</p>
            )}
            {!loading && !error && categories.length > 0 && (
              <div className={styles.categoryGrid}>
                {categories.map((category) => (
                  <button
                    type="button"
                    key={category.id}
                    className={styles.categoryCard}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <StarIcon />
                    <h3>{category.name}</h3>
                    {category.description && <p>{category.description}</p>}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {selectedCategory && (
          <div>
            <button type="button" className="btn btn-secondary" onClick={() => setSelectedCategory(null)}>
              ← Back to categories
            </button>

            <h2 className={styles.selectedCategoryName}>{selectedCategory.name}</h2>

            {nomineesLoading && <p className="page-message">Loading nominees…</p>}
            {!nomineesLoading && nomineesError && <p className="page-message">{nomineesError}</p>}
            {!nomineesLoading && !nomineesError && nominees.length === 0 && (
              <p className="page-message">No approved nominees yet for this category.</p>
            )}
            {!nomineesLoading && !nomineesError && nominees.length > 0 && (
              <div className={styles.nomineeGrid}>
                {nominees.map((nominee) => (
                  <div className={styles.nomineeCard} key={nominee.id}>
                    <span className={styles.nomineeCode}>{nominee.code}</span>
                    <h3>{nominee.full_name}</h3>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
