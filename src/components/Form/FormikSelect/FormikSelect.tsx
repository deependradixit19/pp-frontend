import { ErrorMessage, Field } from 'formik'
import { FC, FocusEvent, useMemo, useState } from 'react'
import { IconDownChevron } from '../../../assets/svg/sprite'
import styles from './_FormikSelect.module.scss'

export const FormikSelect: FC<{
  label: string
  fieldName: string
  options: { value: string; label: string; data?: any }[]
  selectedValue: string
  // notSearchable?: boolean;
  onChange: (selected: { value: string; label: string; data?: any }) => void
  onTouched: Function
}> = ({
  label,
  fieldName,
  options,
  selectedValue,
  onChange,
  onTouched
  // search,
  // setSearch,
  // notSearchable = false,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  // const [search, setSearch] = useState('');

  const selectedLabel = useMemo(
    () => options.find(option => option.value === selectedValue)?.label,
    [options, selectedValue]
  )

  // useEffect(() => {
  //   setSearch(selectedLabel ?? '');
  //   // return () => {
  //   //   second
  //   // }
  // }, [selectedLabel]);

  return (
    <div
      className={`formikInput ${styles.selectContainer} ${isDropdownOpen ? styles.selectDropdownOpen : ''}`}
      onClick={() => {
        setIsDropdownOpen(prevValue => !prevValue)
      }}
      onBlur={(e: FocusEvent) => {
        // if (!e.currentTarget.contains(e.relatedTarget as any)) {
        // Not triggered when swapping focus between children
        setIsDropdownOpen(false)
        // setSearch('');
        onTouched()
        // }
        // else if (e.currentTarget === e.target) {
        //   setIsDropdownOpen(false);
        //   // setSearch('');
        //   onTouched();
        // }
      }}
      tabIndex={0}
    >
      <label
        className={`formikInput__label
        ${selectedValue ? 'filled' : ''}`}
        // htmlFor={fieldName}
      >
        {label}
      </label>
      {/* <input
          // ref={inputElement}
          readOnly={notSearchable}
          type="text"
          onFocus={() => setIsDropdownOpen(true)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`formikInput__field formikInput__field--filled ${styles.formikSelect}`}

          onClick={() => { setIsDropdownOpen((prevValue) => !prevValue); }}
          onBlur={() => {
            setIsDropdownOpen(false);
            // setSearch('');
            onTouched();
          }}
          tabIndex={0}
          // className={`dropdown-select-input ${
          //   dropdownOpen && 'dropdown-select-input-open'
          // }`}
          // style={{
          //   paddingLeft: `${
          //     icon ? `${iconWidth ? `${iconWidth}px` : '50px'}` : '15px'
          //   }`,
          // }}
        /> */}
      <div className={`formikInput__field formikInput__field--filled ${styles.formikSelect}`}>
        <span>{selectedLabel}</span>
        {isDropdownOpen && (
          <div className={styles.dropdown}>
            {
              options &&
                // (search.trim() !== ''
                // ? options.filter((option) =>
                //     option.label.toLowerCase().includes(search.toLowerCase())
                //   ).map((option) => (
                //   <div key={option.value} onClick={() => onChange(option)}>
                //     {option.label}
                //   </div>
                //   )) :
                options.map(option => (
                  <div key={option.value} onClick={() => onChange(option)}>
                    {option.label}
                  </div>
                ))
              // )
            }
          </div>
        )}
      </div>
      <div className={styles.arrow}>
        <IconDownChevron />
      </div>
      <Field type='hidden' name={fieldName} />
      <ErrorMessage component='div' className='formikInput__error' name={fieldName} />
    </div>
  )
}
