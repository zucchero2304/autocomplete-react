import { useEffect, useState } from 'react';
import './App.css';

function Autocomplete() {

    const [itemsBase, setItemsBase] = useState(["Pisa", "Lodz", "Warsaw", "Wisla", "Tokyo", "New York", "Paris", "Wadowice", "Turin", "Rome", "Madrid", "Barcelona", "Liverpool", "Milan", "Los Angeles", "Krakow", "Poznan", "Katowice", "London"])
    const [autocompleteItems, setAutocompleteItems] = useState(null)
    const [addedItems, setAddedItems] = useState([]) //stores selected items
    const [addedItemsDisplay, setAddedItemsDisplay] = useState(null)
    const [inputValue, setInputValue] = useState("")
    const [showSuggestionsBox, setShowSuggestionsBox] = useState(false)

    const handleDeleteItem = (index) => {
        let items = [...addedItems]
        items.splice(index, 1)
        console.log(items)
        setAddedItems(items)
    }

    useEffect(() => {
        let arr = addedItems.map((item, index) => {
            return <button key={index} onClick={() => handleDeleteItem(index)}>{item}</button>
        })
        setAddedItemsDisplay(arr)
    }, [addedItems])

    //autocomplete box items:
    useEffect(() => {
        let ind = -1
        let arr = itemsBase.map((item, index) => {
            let inputAsArray = Array.from(inputValue)
            let same = true
            Array.from(item).slice(0, inputAsArray.length).forEach((element, index) => {
                if (element !== inputAsArray[index]) same = false
            })
            if (same) {
                ind++
                return (<button
                    className={'autocomplete-item ' + ind}
                    key={"listItem" + index}
                    onClick={() => handleAddItem(item)}
                >{item}</button>)
            } else return null
        })
        let filteredArr = arr.filter((el) => el !== null)
        setAutocompleteItems(filteredArr)
    }, [inputValue, itemsBase])

    const handleAddItem = (item) => {
        setAddedItems(prevAddedItems => [...prevAddedItems, item])
        setInputValue("")
        document.getElementById("inputField").focus()
    }

    useEffect(() => {
        if (autocompleteItems === null || autocompleteItems.length === 0 || inputValue.length < 1) {
            setShowSuggestionsBox(false)
        } else setShowSuggestionsBox(true)
    }, [autocompleteItems, inputValue])

    const addFromInput = (event) => {
        if (event.key === "Enter") {
            let item = document.getElementById("inputField").value
            if (item !== " " && item !== "") {
                setAddedItems(prevAddedItems => [...prevAddedItems, item])
                document.getElementById("inputField").value = ''
            }
        }
    }

    //handling keyboard clicks
    document.onkeydown = (e) => {
        if (showSuggestionsBox) {
            if (["ArrowUp", "ArrowDown"].includes(e.key)) {
                let items = document.getElementsByClassName("autocomplete-item")
                if (!Array.from(items).includes(document.activeElement)) {
                    items[0].focus()
                } else {
                    let currentElementIndex = parseInt((document.activeElement.getAttribute("class")).split(" ")[1])
                    if (e.key === "ArrowDown" && currentElementIndex < autocompleteItems.length - 1) {
                        items[currentElementIndex + 1].focus()
                    } else if (e.key === "ArrowUp") {
                        if (currentElementIndex > 0) {
                            items[currentElementIndex - 1].focus()
                        } else {
                            let input = document.getElementById("inputField")
                            input.selectionStart = input.selectionEnd = input.value.length;
                            input.focus()
                        }
                    } else if (e.key === "Enter") {
                        items[currentElementIndex].click()
                    }
                }
            }
        }
    }

    return (
        <div className="Autocomplete">
            <div className="input-wrapper">
                {addedItemsDisplay}
                <div>
                    <input id="inputField" type="text" onKeyDown={(e) => addFromInput(e)} onChange={(e) => setInputValue(e.target.value)} value={inputValue}></input>
                </div>
            </div>
            {showSuggestionsBox && (
                <div className="autocomplete-suggestions">
                    {autocompleteItems}
                </div>
            )}
        </div>
    );
}

export default Autocomplete;
