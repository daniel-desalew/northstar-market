function Loader({ label = 'Loading', inline = false }) {
  return (
    <div
      className={`loader ${inline ? 'loader--inline' : ''}`}
      role="status"
      aria-label={label}
    >
      <span className="loader-spinner" aria-hidden="true" />
      <span>{label}...</span>
    </div>
  )
}

export default Loader