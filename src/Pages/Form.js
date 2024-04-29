import React, { ReactElement, ReactNode } from "react";
import PropTypes from "prop-types"
class Form extends React.Component{
    constructor(props) {
        super(props)
        this.state={
            inputs:this.props.inputs,
            errors:{},
            validationSchema:this.props.validationSchema,
            touched:{}
        }
        this.handleSubmit=this.handleSubmit.bind(this)
        this.handleChange=this.handleChange.bind(this)
        this.handleFile=this.handleFile.bind(this)
        this.validateField=this.validateField.bind(this)
    }
    getChildContext(){
        return {onChange:this.handleChange}
    }
    handleChange(event){
        const target=event.target, name=target.name,validationSchema=this.props.validationSchema
        const inputs=this.state.inputs
        var errors=this.state.errors,fieldError
        if (target.type=="file") {
            this.handleFile(target,validationSchema)
            return
        }
        inputs[name]=target.value
        this.setState({inputs:inputs})
        if(validationSchema)
        if (validationSchema.fields[name]){
            try {
                validationSchema.fields[name].validateSync(target.value)
            } catch (error) {
                fieldError=error.message
                this.setState({errors:errors})
            }
            errors[name]=fieldError
            this.setState({errors:errors})
        }
        const touched=this.state.touched
        touched[name]=true
        this.setState({touched:touched})
    }
    handleFile(inputElement,validationSchema){
        const files=inputElement.files
        let error1
        if(validationSchema) {
            if (!validationSchema.fields[inputElement.name]) return
            for (let file of files) {
                const extension = file.name.substring(file.name.lastIndexOf(".") + 1)
                const size = file.size
                try {
                    validationSchema.fields[inputElement.name].validateSync(
                        {extensions: extension, size: size}
                    )
                } catch (error) {
                    error1 = error.message
                }
            }
            const errors = this.state.errors
            errors[inputElement.name] = error1
            this.setState({errors: errors})
            if (error1) return
            const inputs = this.state.inputs
            inputs[inputElement.name] = files
            this.setState({inputs: inputs})
        }
    }
    handleSubmit(event){
        event.preventDefault()
        const elements=event.target.elements,inputs={}
        const touched=this.state.touched
        const errors=this.state.errors
        for(let key of elements){
            inputs[key.name]=key.value
            if (key.type=="file")
                inputs[key.name]=key.files
            touched[key.name]=true
            try {
                if(key.type!="file"){
                    if (this.state.validationSchema)
                   if(Object.keys(this.state.validationSchema.fields).includes(key.name))
                        this.state.validationSchema.fields[key.name].validateSync(key.value)}
            } catch (error) {
                errors[key.name]=error.message
            }
        }
        this.setState({errors:this.props.onSubmit({inputs:inputs,errors:errors}),inputs:inputs,touched:touched })
    }
    validateField(event,myCallBack){
        const inputs=this.state.inputs,touched=this.state.touched
        touched[event.target.name]=true
        inputs[event.target.name]=event.target.value
        const obj={inputs:inputs,errors:this.state.errors}
        const errors=myCallBack(obj)
        this.setState({errors:errors,inputs:inputs})
    }
   render(){
        return (
            <>
            <form onSubmit={this.handleSubmit} className={this.props.class} id={this.props.id} style={this.props.style}>
            {this.props.children({handleChange:this.handleChange,handleFile:this.handleFile,
            errors:this.state.errors,touched:this.state.touched,validateField:this.validateField
            })}
            </form>
            </>
        )
    }
}
Form.childContextTypes={
    onChange:PropTypes.func
}
function Field(props,context){
    const component=props.component||"input"
    const onChange=props.onChange||context.onChange
    const Prps=component=="select"?{onChange:onChange,onSelect:onChange}:{onChange:onChange}
    return (
        React.createElement(component,{...Prps,...props},props.children)
    )
}
Field.contextTypes={
    onChange:PropTypes.func
}
export {Field,Form}