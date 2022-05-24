export const EmailTemplateNames = () => {
    const resp = fetch(`http://equity-help-be.herokuapp.com/api/templates/template/`);
    const res =  resp.json();
    return res;
}