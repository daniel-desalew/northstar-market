function Input({ label, error, id, className = '', ...props }) {
  const inputId = id || props.name

  return (
    <div className="form-field">
      {label && <label htmlFor={inputId}>{label}</label>}
      <input
        id={inputId}
        className={`form-input ${error ? 'form-input--error' : ''} ${className}`.trim()}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && <span className="field-error" id={`${inputId}-error`}>{error}</span>}
    </div>
  )
}

export default Input