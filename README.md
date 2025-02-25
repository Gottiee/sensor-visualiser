# **Sensor Comparator**  

A React-based tool to compare and visualize JSON sensor data. It highlights differences and allows structured viewing.  

## **Installation**  

### **Prerequisites**  
Ensure you have **Node.js** and **npm** or **yarn** installed on your machine.  

### **Steps**  
1. Clone the repository:  
   ```sh
   git clone https://github.com/your-username/sensor-comparator.git
   cd sensor-comparator
   ```  
2. Install dependencies:  
   ```sh
   npm install  
   # or  
   yarn install  
   ```  
3. Start the development server:  
   ```sh
   npm run dev  
   # or  
   yarn dev  
   ```  
4. Open [http://localhost:3000](http://localhost:xxxx) in your browser where x is the port.

## **Usage**  

1. **Input JSON data** in both text fields.  
2. Enable or disable **comparison mode** using the equal button.  
3. The tool **highlights differences** between JSON objects:  
   - 🟥 **Missing keys**: the key is not in the opposite JSON.  
   - 🟨 **Type mismatches** between values.  
4. Click on objects to **expand/collapse** nested structures.  

## **Features**  

✅ **Real-time JSON Comparison**: Instantly highlights key differences.  
✅ **Depth Color**: Different levels are color-coded for clarity.  
✅ **Collapsible JSON Blocks**: Easily navigate large structures.  
✅ **Sticky Mode**: Keeps objects open for better readability.  
✅ **Error Handling**: Detects and displays JSON parsing errors.  

## **File Structure**  

```
/src
 ├── components
 │   ├── App.tsx        # Main application component
 │   ├── SensorStruct.tsx # JSON structure parser & comparison logic
 │   ├── Block.tsx      # Recursive component for rendering JSON objects
 │   └── css/           # Stylesheets
 ├── public/
 ├── package.json
 ├── README.md
```

## **Customization**  

- Modify `Block.tsx` to change **styling** for different levels.  
- Adjust `SensorStruct.tsx` to tweak **comparison rules**.  

## **Contributing**  

1. Fork the repository  
2. Create a new branch:  
   ```sh
   git checkout -b feature-name  
   ```  
3. Commit your changes:  
   ```sh
   git commit -m "Add new feature"  
   ```  
4. Push to your branch:  
   ```sh
   git push origin feature-name  
   ```  
5. Open a Pull Request.  

## JSON Data for example

```json
{"test":1, "test2":"oui", "array":[{"test3": true}], "array2":[{"test4": false}, {"test5": 3}], "testbcptroplongpouroircequecadonnequandcadepasseducadre":"testbcptroplongpouroircequecadonnequandcadepasseducadre", "object":{"jsobject":1}}
```

```json
{"test":1, "array":[{"test3": true}, {"nope":2}, [{"test22":2}]], "object":{"jsobject":1}, "same":"notesame"}
{"test2":"oui", "array":[{"test3": false}, {"nope":3}, {"more":3}], "object":{"jsobject":2}, "same":"noesame"}
```