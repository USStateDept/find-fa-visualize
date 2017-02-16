// <div className="bld-options">
//                 <span className="bld-options-message">
//                   {this.props.buildMessage && this.props.buildMessage}
//                 </span>
//                 <br />
//                 <span
//                   className="bld-options-btn"
//                   onClick={() => {
//                     this.props.resetAllFields();
//                   }}
//                 >clear/reset</span>
//                 <span
//                   className="bld-options-btn"
//                   onClick={() => {
//                     initSave();
//                   }}
//                 >save/share</span>
//               </div>
// <div className="row">
//           <div className="col-md-4 viz-sum-box">
//             <div className="viz-sum-column">
//               <strong>Indicators:</strong>
//               {selectedIndicators.map((ind, i) => (
//                 <span
//                   key={i}
//                   className="viz-summary"
//                   onClick={this.selectInd.bind(this, ind)}
//                 >
//                   {" " + ind.name} <span className="viz-sum-x">❌</span>
//                 </span>
//               ))}
//             </div>
//           </div>
//           <div className="col-md-4 viz-sum-box">
//             <div className="viz-sum-column">
//               <strong>Countries/Regions:</strong>
//               {selectedRegions.map((reg, i) => (
//                 <span
//                   key={i}
//                   className="viz-summary"
//                   onClick={this.selectReg.bind(this, reg)}
//                 >
//                   {" " + reg.Name} <span className="viz-sum-x">❌</span>
//                 </span>
//               ))}
//               {selectedCountries.map((cty, i) => (
//                 <span
//                   key={i}
//                   className="viz-summary"
//                   onClick={this.selectCty.bind(this, cty)}
//                 >
//                   {" " + cty.Name} <span className="viz-sum-x">❌</span>
//                 </span>
//               ))}
//             </div>
//           </div>
//           <div className="col-md-4 viz-sum-box">
//             <div className="viz-sum-column">
//               <strong>Chart:</strong>
//               <span
//                 className="viz-summary"
//                 onClick={this.selectChart.bind(this, selectedChart)}
//               >
//                 {selectedChart != undefined &&
//                   selectedChart != "" &&
//                   <span>
//                     {" " + selectedChart}
//                     {" "}
//                     <span className="viz-sum-x">❌</span>
//                   </span>}
//               </span>
//             </div>
//           </div>
//         </div>
