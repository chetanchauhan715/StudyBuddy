import SubjectManager from "../components/settings/SubjectManager";

function Settings(){

       
// if(loading){
//     return <Loader/>
// }

    return (
        <div className="setting-page">
            <h1>Settings</h1>

            <SubjectManager />
        </div>
    )
}

export default Settings;