import '../css/components/customCheckButton.css'

export default function CustomCheckButton({checkedState, onClickFunc}) {
  return (
    <label>
        {checkedState ?
          <input checked type="checkbox" class="input" onClick={onClickFunc}/>
        : 
          <input type="checkbox" class="input" onClick={onClickFunc}/>
        }
        <span className="custom-checkbox"></span>
    </label>
  )
}
